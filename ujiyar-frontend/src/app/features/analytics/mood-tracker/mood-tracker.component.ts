import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodLogService } from '../../../services/mood-log.service';

interface MoodOption {
  emoji: string;
  label: string;
  colorClass: string;
  value: number;
}

@Component({
  selector: 'app-mood-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood-tracker.component.html'
})
export class MoodTrackerComponent implements OnInit {
  moods: MoodOption[] = [
    { emoji: '☀️', label: 'Radiant', colorClass: 'border-amber-400 bg-amber-50 text-amber-700', value: 5 },
    { emoji: '🌱', label: 'Calm', colorClass: 'border-emerald-400 bg-emerald-50 text-emerald-700', value: 4 },
    { emoji: '☁️', label: 'Tired', colorClass: 'border-slate-300 bg-slate-50 text-slate-600', value: 3 },
    { emoji: '🌧️', label: 'Anxious', colorClass: 'border-blue-400 bg-blue-50 text-blue-700', value: 2 },
    { emoji: '⛈️', label: 'Overwhelmed', colorClass: 'border-purple-400 bg-purple-50 text-purple-700', value: 1 }
  ];

  selectedMood: MoodOption | null = null;
  journalText: string = '';
  isAnonymous: boolean = false;
  isSaving: boolean = false;
  
  loggedEntries: any[] = [];

  constructor(private moodLogService: MoodLogService) {}

  ngOnInit() {
    this.loadRecentEntries();
  }

  loadRecentEntries() {
    this.moodLogService.getRecentLogs('user-123', 1).subscribe({
      next: (data: any[]) => {
        this.loggedEntries = data
          .map(item => ({
            id: item.id || item.Id,
            mood: this.moods.find(m => m.value === Number(item.value || item.Value)) || this.moods[2],
            note: item.journalNote || item.JournalNote || '',
            date: new Date(item.createdAt || item.CreatedAt),
            private: false 
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      error: (err: any) => console.error(err)
    });
  }

  selectMood(mood: MoodOption) {
    this.selectedMood = mood;
  }

  saveReflection() {
    if (!this.selectedMood) return;
    this.isSaving = true;

    this.moodLogService.saveReflection('user-123', this.selectedMood.value, this.journalText).subscribe({
      next: () => {
        this.loadRecentEntries();
        this.selectedMood = null;
        this.journalText = '';
        this.isSaving = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isSaving = false;
      }
    });
  }
}