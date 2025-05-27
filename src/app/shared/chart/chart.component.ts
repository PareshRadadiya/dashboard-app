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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() type: 'bar' | 'line' | 'area' | 'donut' | 'sparkline' | 'pie' | 'bubble' = 'bar';
  @Input() label = '';
  @Input() value = '';
  @Input() apiChartData: { labels: string[], values: number[], previous?: number[], target?: number, colors?: string[] } | null = null;

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
    const defaultColors = [
      'rgba(59, 130, 246, 0.5)',
      'rgba(16, 185, 129, 0.5)',
      'rgba(245, 158, 11, 0.5)',
      'rgba(239, 68, 68, 0.5)',
      'rgba(99, 102, 241, 0.5)',
      'rgba(236, 72, 153, 0.5)',
      'rgba(147, 51, 234, 0.5)',
      'rgba(251, 113, 133, 0.5)',
    ];

    // Use colors from API if available, otherwise use default colors
    const colors = this.apiChartData!.colors || defaultColors;
    const backgroundColors = colors.map(color =>
      color.startsWith('#') ? this.hexToRgba(color, 0.5) : color
    );

    const bubbleData = this.apiChartData!.labels.map((_, i) => ({
      x: Math.random() * 100,
      y: this.apiChartData!.values[i],
      r: Math.random() * 15 + 5
    }));

    return {
      labels: this.type === 'bubble' ? undefined : this.apiChartData!.labels,
      datasets: [
        {
          data: this.type === 'bubble' ? bubbleData : this.apiChartData!.values,
          label: this.label,
          backgroundColor: this.type === 'bar' || this.type === 'pie'
            ? backgroundColors.slice(0, this.apiChartData!.values.length)
            : this.type === 'bubble'
            ? backgroundColors[0]
            : backgroundColors[0],
          borderColor: this.type === 'pie'
            ? colors.slice(0, this.apiChartData!.values.length)
            : colors[0] || 'rgb(59, 130, 246)',
          borderWidth: this.type === 'pie' ? 1 : 2,
          fill: this.type === 'line' || this.type === 'area',
          tension: this.type === 'line' ? 0.4 : 0,
          pointRadius: this.type === 'line' ? 0 : this.type === 'bubble' ? undefined : undefined,
        },
      ],
    };
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getChartType(): ChartType {
    return this.type as ChartType;
  }
}
