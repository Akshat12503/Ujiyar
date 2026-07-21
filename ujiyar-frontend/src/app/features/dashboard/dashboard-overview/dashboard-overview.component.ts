import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoodTrackerComponent } from '../../analytics/mood-tracker/mood-tracker.component';
import { AnalyticsDashboardComponent } from '../../analytics/analytics-dashboard/analytics-dashboard.component';

interface DayGlance {
  label: string;
  logged: boolean;
  emoji: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, MoodTrackerComponent, AnalyticsDashboardComponent],
  templateUrl: './dashboard-overview.html'
})
export class DashboardOverviewComponent {
  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // TODO: wire this to real mood-log data via MoodLogService once weekly aggregation endpoint exists.
  // For now this renders a representative pattern so the layout and logic are ready to plug in.
  get weekGlance(): DayGlance[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

    return days.map((label, i) => ({
      label,
      logged: i < todayIndex,
      emoji: '🌱',
      colorClass: 'bg-[#A8C5A0]/20 border-[#A8C5A0]/40 text-[#5C7A56] dark:text-[#A8C5A0]'
    }));
  }
}