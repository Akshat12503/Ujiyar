import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MoodLogService } from '../../../services/mood-log.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

interface MoodLog {
  id: string;
  value: number;
  journalNote: string;
  createdAt: string;
  userId: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.component.html'
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('trendChart', { static: false }) trendChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  activeFilter: '3d' | '7d' | '14d' | '1m' = '7d';
  isLoading: boolean = false;
  logs: MoodLog[] = []; 
  private refreshSub!: Subscription; 

  constructor(private moodLogService: MoodLogService) {}

  ngOnInit() {
    this.fetchDataForTimeframe(this.activeFilter);

    this.refreshSub = this.moodLogService.refreshNeeded$.subscribe(() => {
      this.fetchDataForTimeframe(this.activeFilter);
    });
  }

  private getDaysFromFilter(filter: string): number {
    switch (filter) {
      case '3d': return 3;
      case '7d': return 7;
      case '14d': return 14;
      case '1m': return 30;
      default: return 7;
    }
  }

  get totalReflections(): number {
    return this.logs.length;
  }

  get averageMood(): number {
    if (this.logs.length === 0) return 0;
    const sum = this.logs.reduce((acc, log) => acc + log.value, 0);
    return parseFloat((sum / this.logs.length).toFixed(1));
  }

  getMoodLabel(value: number): string {
    const labels: Record<number, string> = { 
      1: 'Overwhelmed ⛈️', 
      2: 'Anxious 🌧️', 
      3: 'Tired ☁️', 
      4: 'Calm 🌱', 
      5: 'Radiant ☀️' 
    };
    return labels[value] || 'Unknown';
  }

  loadDashboardData() {
    this.fetchDataForTimeframe(this.activeFilter);
  }

fetchDataForTimeframe(filter: '3d' | '7d' | '14d' | '1m') {
    this.isLoading = true;
    const daysToFetch = this.getDaysFromFilter(filter);

    this.moodLogService.getRecentLogs('user-123', daysToFetch).subscribe({
      next: (rawData: any[]) => {
        console.log(`Fetched data for ${filter}: ${rawData.length} entries found.`);
        this.logs = rawData.map(item => ({
          id: item.id || item.Id,
          value: Number(item.value || item.Value || 3), 
          journalNote: item.journalNote || item.JournalNote || '',
          createdAt: item.createdAt || item.CreatedAt,
          userId: item.userId || item.UserId
        })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        this.isLoading = false;
        
        setTimeout(() => {
          // THE FIX: If an old chart exists, destroy it because its canvas was deleted by *ngIf
          if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
          }
          
          // Rebuild the chart on the newly rendered canvas and push the data
          this.renderEmptyChartInstance();
          this.updateChartData();
        }, 50);
      },
      error: (err: any) => {
        console.error('Error fetching chart data:', err);
        this.isLoading = false;
      }
    });
  }

  updateChartData() {
    if (!this.chartInstance) return;

    this.chartInstance.data.labels = this.logs.map(log => 
      new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    );
    this.chartInstance.data.datasets[0].data = this.logs.map(log => log.value);
    this.chartInstance.update();
  }

  renderEmptyChartInstance() {
    if (!this.trendChartCanvas?.nativeElement) return;
    
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [{
          label: 'Mental Baseline Balance',
          data: [],
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.05)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#16a34a',
          pointRadius: 4
      }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 1, max: 5, ticks: { stepSize: 1, callback: (value) => 
            ({ 1: '⛈️', 2: '🌧️', 3: '☁️', 4: '🌱', 5: '☀️' }[Number(value)] || value) 
          }, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  changeTimeframe(filter: '3d' | '7d' | '14d' | '1m') {
    if (this.activeFilter === filter) return; 
    this.activeFilter = filter;
    this.fetchDataForTimeframe(filter); 
  }

  ngOnDestroy() {
    this.chartInstance?.destroy();
    this.refreshSub?.unsubscribe();
  }
}