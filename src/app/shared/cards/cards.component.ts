import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export type CardChartType = 'bar' | 'line' | 'area' | 'donut' | 'sparkline';

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
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() description = '';
  @Input() timeFrame = '';
  @Input() chartType: CardChartType = 'bar';
  @Input() icon = 'analytics'; // Default icon
}
