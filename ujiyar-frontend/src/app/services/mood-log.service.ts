import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoodLogService {
  // This matches the URL Swagger was running on!
  private apiUrl = 'http://localhost:5165/api/MoodLogs';

  constructor(private http: HttpClient) { }

  // This method sends the data to your .NET Controller
  saveReflection(userId: string, value: number, journalNote: string): Observable<any> {
    const payload = {
      userId: userId,
      value: value,
      journalNote: journalNote
    };
    
    return this.http.post(this.apiUrl, payload);
  }
}