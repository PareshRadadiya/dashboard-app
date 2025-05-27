import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export type CardChartType = 'bar' | 'line';

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

@Component({
  standalone: true,
  selector: 'app-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    ChartComponent,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() description = '';
  @Input() timeFrame = '';
  @Input() chartType: CardChartType = 'bar';
  @Input() icon = 'analytics';
  @Input() chartData: ChartData | null = null;
  @Input() trend = '';
  @Input() comparisonLabel = '';
}
