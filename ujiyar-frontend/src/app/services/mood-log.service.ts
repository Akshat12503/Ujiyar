import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators'; // <-- Notice we added 'map'

@Injectable({
  providedIn: 'root'
})
export class MoodLogService {
  private apiUrl = 'http://localhost:5165/api/MoodLogs';

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) { }

  saveReflection(userId: string, value: number, journalNote: string): Observable<any> {
    // Sending the raw integer to C# is the safest way to bind to an Enum
    const payload = { 
      userId: userId, 
      moodValue: value, 
      journalNote: journalNote 
    };
    
    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => this._refreshNeeded$.next())
    );
  }

  getRecentLogs(userId: string, days: number = 7): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}?days=${days}`).pipe(
      // The Interceptor: Map over the incoming array and sanitize each object
      map(data => data.map(item => this.sanitizeBackendData(item)))
    );
  }

  // --- THE C# ENUM TRANSLATOR ---
  private sanitizeBackendData(item: any): any {
    let parsedValue = 3; // Default to neutral
    
    // Grab the value regardless of C# casing
    const raw = item.value !== undefined ? item.value : item.Value;

    if (typeof raw === 'string') {
      // If C# returned a String Enum (e.g., "Radiant")
      const s = raw.toLowerCase();
      if (s.includes('radiant') || s === '5') parsedValue = 5;
      else if (s.includes('calm') || s === '4') parsedValue = 4;
      else if (s.includes('anxious') || s === '2') parsedValue = 2;
      else if (s.includes('overwhelmed') || s === '1') parsedValue = 1;
      else parsedValue = 3; // Tired/Neutral
    } else if (typeof raw === 'number') {
      // If C# returned a Number
      parsedValue = raw;
      if (raw === 0) parsedValue = 1; // Catch if C# defaulted to a 0-index
    }

    // Return a perfectly normalized object for Angular to consume safely
    return {
      id: item.id || item.Id,
      value: parsedValue,
      journalNote: item.journalNote || item.JournalNote || '',
      createdAt: item.createdAt || item.CreatedAt,
      userId: item.userId || item.UserId
    };
  }
}