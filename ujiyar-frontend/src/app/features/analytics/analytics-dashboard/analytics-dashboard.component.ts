import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MoodLogService } from '../../../services/mood-log.service';

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
  @ViewChild('trendChart') trendChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  activeFilter: '3d' | '7d' | '14d' | '1m' = '7d';
  
  isLoading: boolean = false;
  logs: MoodLog[] = []; 

  constructor(private moodLogService: MoodLogService) {}

  ngOnInit() {
    this.fetchDataForTimeframe(this.activeFilter);
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
    const labels: Record<number, string> = { 1: 'Overwhelmed 😔', 2: 'Anxious 😟', 3: 'Neutral 😐', 4: 'Good 🙂', 5: 'Excellent 😄' };
    return labels[value] || 'Unknown';
  }

  loadDashboardData() {
    this.fetchDataForTimeframe(this.activeFilter);
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

  fetchDataForTimeframe(filter: '3d' | '7d' | '14d' | '1m') {
    if (this.logs.length === 0) this.isLoading = true;
    
    const daysToFetch = this.getDaysFromFilter(filter);

    this.moodLogService.getRecentLogs('user-123', daysToFetch).subscribe({
      next: (rawData: any[]) => {
        this.logs = rawData.map(item => ({
          id: item.id || item.Id,
          value: Number(item.value || item.Value || 3), 
          journalNote: item.journalNote || item.JournalNote || '',
          createdAt: item.createdAt || item.CreatedAt,
          userId: item.userId || item.UserId
        })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        this.isLoading = false;

        // THE FIX: Wait 1 tick for Angular to put the <canvas> back into the HTML
        setTimeout(() => {
          if (!this.chartInstance) {
            this.renderEmptyChartInstance();
          }
          this.updateChartData();
        }, 0);
      },
      error: (err: any) => {
        console.error('Error fetching real chart data:', err);
        this.isLoading = false;
      }
    });
  }

  updateChartData() {
    if (!this.chartInstance) return;

    const newLabels = this.logs.map(log => {
      const date = new Date(log.createdAt);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    const newDataPoints = this.logs.map(log => log.value);

    this.chartInstance.data.labels = newLabels;
    this.chartInstance.data.datasets[0].data = newDataPoints;
    
    this.chartInstance.update();
  }

  renderEmptyChartInstance() {
    if (!this.trendChartCanvas) return;

    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], 
        datasets: [{
          label: 'Mental Baseline Balance',
          data: [], 
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.05)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#16a34a',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                const labels: Record<number, string> = { 1: '⛈️', 2: '🌧️', 3: '☁️', 4: '🌱', 5: '☀️' };
                return labels[Number(value)] || value;
              }
            },
            grid: { color: '#f1f5f9' }
          },
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
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}