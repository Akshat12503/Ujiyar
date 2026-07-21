import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodLogService } from '../../../services/mood-log.service';
import { AuthService } from '../../../services/auth.service';

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
    { emoji: '☀️', label: 'Radiant', colorClass: 'border-[#E8B86D] bg-[#E8B86D]/10 text-[#8A6323] ring-[#E8B86D]', value: 5 },
    { emoji: '🌱', label: 'Calm', colorClass: 'border-[#A8C5A0] bg-[#A8C5A0]/15 text-[#5C7A56] ring-[#A8C5A0]', value: 4 },
    { emoji: '☁️', label: 'Tired', colorClass: 'border-[#B8C4C8] bg-[#B8C4C8]/20 text-[#5C6C70] ring-[#B8C4C8]', value: 3 },
    { emoji: '🌧️', label: 'Anxious', colorClass: 'border-[#88AFCB] bg-[#88AFCB]/12 text-[#3D6889] ring-[#88AFCB]', value: 2 },
    { emoji: '⛈️', label: 'Overwhelmed', colorClass: 'border-[#A597C4] bg-[#A597C4]/12 text-[#5D4E80] ring-[#A597C4]', value: 1 }
  ];

  selectedMood: MoodOption | null = null;
  journalText: string = '';
  isAnonymous: boolean = false;
  isSaving: boolean = false;
  aiCoachResponse: string = '';

  loggedEntries: any[] = [];
  private currentUserId: string = '';

  constructor(
    private moodLogService: MoodLogService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get the real logged-in user's ID from AuthService
    this.currentUserId = this.authService.currentUserValue?.id ?? '';
    this.loadRecentEntries();
  }

  loadRecentEntries() {
    this.moodLogService.getRecentLogs(this.currentUserId, 1).subscribe({
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
    this.aiCoachResponse = '';

    this.moodLogService.saveReflection(this.currentUserId, this.selectedMood.value, this.journalText).subscribe({
      next: (response: any) => {
        this.aiCoachResponse = response.aiMessage;
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