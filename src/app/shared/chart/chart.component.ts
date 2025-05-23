import {
  Component,
  Input,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Chart as ChartJS,
  ChartConfiguration,
  ChartData,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { generateChartData } from './chart.utils';

// Register Chart.js components only in browser environment
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas
        *ngIf="isBrowser"
        baseChart
        [type]="getChartType()"
        [data]="chartData"
        [options]="chartOptions"
      >
      </canvas>
      <div *ngIf="!isBrowser" class="ssr-placeholder">Chart loading...</div>
    </div>
  `,
  styles: [
    `
      .chart-container {
        position: relative;
        height: 60px;
        width: 100%;
      }
      .ssr-placeholder {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        color: #666;
      }
    `,
  ],
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() type: 'bar' | 'line' | 'area' | 'donut' | 'sparkline' = 'bar';
  @Input() label = '';
  @Input() value = '';

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  chartData: ChartData = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  ngOnInit() {
    if (this.isBrowser) {
      this.chartData = generateChartData(this.type, this.label);
      // Update chart when data changes
      setTimeout(() => this.chart?.update(), 0);
    }
  }

  getChartType(): ChartType {
    return this.type as ChartType;
  }
}
