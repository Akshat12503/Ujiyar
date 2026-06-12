import { Component } from '@angular/core';
import { MoodTrackerComponent } from '../../analytics/mood-tracker/mood-tracker.component';
import { AnalyticsDashboardComponent } from '../../analytics/analytics-dashboard/analytics-dashboard.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [MoodTrackerComponent, AnalyticsDashboardComponent], // Both must be registered here
  templateUrl: './dashboard-overview.html'
})
export class DashboardOverviewComponent {}