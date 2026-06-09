import { Component } from '@angular/core';
import { MoodTrackerComponent } from '../../analytics/mood-tracker/mood-tracker.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [MoodTrackerComponent], // Injected tracker component view
  templateUrl: './dashboard-overview.html'
})
export class DashboardOverviewComponent {}