import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodLogService } from '../../../services/mood-log.service';
import { AuthService } from '../../../services/auth.service';

interface MoodOption {
  emoji: string;
  label: string;
  colorClass: string;
  dotColor: string;
  value: number;
  angleDeg: number;
}

// Dial geometry: semicircle centered at (150,150), radius 120.
// angleDeg is measured from the positive x-axis (0deg = right/best, 180deg = left/worst).
const DIAL_CENTER = { x: 150, y: 150 };
const DIAL_RADIUS = 120;
const NEEDLE_LENGTH = 96;

function pointOnArc(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: DIAL_CENTER.x + radius * Math.cos(rad),
    y: DIAL_CENTER.y - radius * Math.sin(rad)
  };
}

@Component({
  selector: 'app-mood-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood-tracker.component.html'
})
export class MoodTrackerComponent implements OnInit {
  dialCenter = DIAL_CENTER;
  dialRadius = DIAL_RADIUS;

  // Storm (worst) sits on the left, sun (best) on the right - reads like a weather horizon.
  moods: MoodOption[] = [
    { emoji: '⛈️', label: 'Overwhelmed', colorClass: 'text-[#5D4E80] dark:text-[#C3B4E0]', dotColor: '#A597C4', value: 1, angleDeg: 180 },
    { emoji: '🌧️', label: 'Anxious', colorClass: 'text-[#3D6889] dark:text-[#A9CBE3]', dotColor: '#88AFCB', value: 2, angleDeg: 135 },
    { emoji: '☁️', label: 'Tired', colorClass: 'text-[#5C6C70] dark:text-[#C7D1D4]', dotColor: '#B8C4C8', value: 3, angleDeg: 90 },
    { emoji: '🌱', label: 'Calm', colorClass: 'text-[#5C7A56] dark:text-[#C3DABE]', dotColor: '#A8C5A0', value: 4, angleDeg: 45 },
    { emoji: '☀️', label: 'Radiant', colorClass: 'text-[#8A6323] dark:text-[#F0D19E]', dotColor: '#E8B86D', value: 5, angleDeg: 0 }
  ];

  getTickPosition(mood: MoodOption) {
    return pointOnArc(mood.angleDeg, this.dialRadius);
  }

  get needleAngle(): number {
    return this.selectedMood ? this.selectedMood.angleDeg : 90;
  }

  get needleEnd() {
    return pointOnArc(this.needleAngle, NEEDLE_LENGTH);
  }

  get needleColor(): string {
    return this.selectedMood ? this.selectedMood.dotColor : '#B8C4C8';
  }

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