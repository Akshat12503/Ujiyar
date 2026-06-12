import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Definition matrix matching configuration options to chart data states
interface TimeframeConfig {
  labels: string[];
  data: number[];
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule], // Added for structural directive rendering template bindings
  templateUrl: './analytics-dashboard.component.html'
})
export class AnalyticsDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trendChart') trendChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  activeFilter: '3d' | '7d' | '14d' | '1m' = '7d'; // Default initial configuration flag

  // Mock data registry representing granular backfilled historical logs
  timeframeData: Record<'3d' | '7d' | '14d' | '1m', TimeframeConfig> = {
    '3d': {
      labels: ['Fri', 'Sat', 'Sun'],
      data: [4, 3, 5]
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [3, 4, 2, 5, 4, 3, 5]
    },
    '14d': {
      labels: ['W1 Mon', 'Wed', 'Fri', 'W2 Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [4, 5, 3, 4, 3, 4, 2, 5, 4, 5]
    },
    '1m': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [3.2, 4.1, 3.5, 4.6]
    }
  };

  ngAfterViewInit() {
    this.renderChartInstance();
  }

  renderChartInstance() {
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const currentConfig = this.timeframeData[this.activeFilter];

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentConfig.labels,
        datasets: [{
          label: 'Mental Baseline Balance',
          data: currentConfig.data,
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

  // Active trigger to mutate chart presentation configs at runtime smoothly
  changeTimeframe(filter: '3d' | '7d' | '14d' | '1m') {
    this.activeFilter = filter;
    if (!this.chartInstance) return;

    const targetConfig = this.timeframeData[filter];
    
    // Direct modification of ChartJS memory instance properties
    this.chartInstance.data.labels = targetConfig.labels;
    this.chartInstance.data.datasets[0].data = targetConfig.data;
    
    // Call native update animation engine run
    this.chartInstance.update();
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}