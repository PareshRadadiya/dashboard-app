import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
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
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;  @Input() type: 'bar' | 'line' = 'bar';
  @Input() label = '';
  @Input() apiChartData: { labels: string[], values: number[], colors?: string[] } | null = null;

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
      this.updateChartData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isBrowser && changes['apiChartData']) {
      this.updateChartData();
      setTimeout(() => this.chart?.update(), 0);
    }
  }

  private updateChartData() {
    if (this.apiChartData && this.apiChartData.labels.length > 0 && this.apiChartData.values.length > 0) {
      // Use API data
      this.chartData = this.createChartDataFromAPI();
    } else {
      // Fallback to generated data
      this.chartData = generateChartData(this.type, this.label);
    }
  }
  private createChartDataFromAPI(): ChartData {
    return {
      labels: this.apiChartData!.labels,
      datasets: [
        {
          data: this.apiChartData!.values,
          label: this.label,
          backgroundColor: this.type === 'bar'
            ? this.apiChartData!.colors || ['rgba(59, 130, 246, 0.5)']
            : 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: this.type === 'line',
          tension: this.type === 'line' ? 0.4 : 0,
          pointRadius: this.type === 'line' ? 0 : undefined,
        },
      ],
    };
  }

  getChartType(): ChartType {
    return this.type as ChartType;
  }
}
