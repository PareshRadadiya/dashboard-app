import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/cards/cards.component';
import { DashboardService, Card } from '../../services/dashboard.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  cards: Card[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Loading dashboard data...');
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.dashboardService
      .getCards()
      .pipe(
        catchError((error) => {
          console.error('Error loading cards:', error);
          this.error = 'Failed to load dashboard data. Please try again later.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((cards) => {
        console.log('Loaded cards:', cards);
        this.cards = cards;

        // Log each card's chart data for debugging
        cards.forEach((card) => {
          console.log(`Card ${card.title} chart data:`, {
            chartType: card.chartType,
            chartData: card.chartData,
            labels: card.chartData?.labels,
            values: card.chartData?.values,
          });
        });

        // Force change detection after data is loaded
        setTimeout(() => {
          this.cdr.detectChanges();
        });
      });
  }
}
