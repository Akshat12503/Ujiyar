import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MoodOption {
  emoji: string;
  label: string;
  colorClass: string;
}

@Component({
  selector: 'app-mood-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood-tracker.component.html'
})
export class MoodTrackerComponent {
  // Predefined mood catalog mapping to our Tailwind configuration branding metrics
  moods: MoodOption[] = [
    { emoji: '☀️', label: 'Radiant', colorClass: 'border-amber-400 bg-amber-50 text-amber-700' },
    { emoji: '🌱', label: 'Calm', colorClass: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
    { emoji: '☁️', label: 'Tired', colorClass: 'border-slate-300 bg-slate-50 text-slate-600' },
    { emoji: '🌧️', label: 'Anxious', colorClass: 'border-blue-400 bg-blue-50 text-blue-700' },
    { emoji: '⛈️', label: 'Overwhelmed', colorClass: 'border-purple-400 bg-purple-50 text-purple-700' }
  ];

  selectedMood: MoodOption | null = null;
  journalText: string = '';
  isAnonymous: boolean = false;
  
  // Local mock registry array to simulate database state updates
  loggedEntries: Array<{ date: Date; mood: MoodOption; note: string; private: boolean }> = [];

  selectMood(mood: MoodOption) {
    this.selectedMood = mood;
  }

  saveReflection() {
    if (!this.selectedMood) return;

    const newEntry = {
      date: new Date(),
      mood: this.selectedMood,
      note: this.journalText,
      private: this.isAnonymous
    };

    // Prepend to our view array to simulate real-time layout ingestion updates
    this.loggedEntries.unshift(newEntry);
    
    console.log('Mock checkpoint: Entry cached successfully.', newEntry);
    alert(`Your reflection baseline has been saved locally! Entry log updated.`);

    // Flush fields cleanly for subsequent inputs
    this.selectedMood = null;
    this.journalText = '';
  }
}