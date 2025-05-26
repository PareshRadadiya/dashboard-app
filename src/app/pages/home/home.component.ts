import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../shared/cards/cards.component';
import { TransactionsTableComponent } from '../../shared/transactions-table/transactions-table.component';
import { DashboardService } from '../../services/dashboard.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
} from 'rxjs';
import { Card, Transaction } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CardComponent,
    TransactionsTableComponent,
  ],
})
export class HomeComponent implements OnInit {
  private metricsSubject = new BehaviorSubject<Card[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  metrics$ = this.metricsSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading$.next(true);
    this.error$.next(null);

    forkJoin({
      metrics: this.dashboardService.getCards(),
      transactions: this.dashboardService.getTransactions(),
    })
      .pipe(
        catchError((error) => {
          console.error('Error loading dashboard data:', error);
          this.error$.next('Failed to load dashboard data. Please try again.');
          return of({ metrics: [], transactions: [] });
        }),
        finalize(() => {
          this.loading$.next(false);
        })
      )
      .subscribe({
        next: ({ metrics, transactions }) => {
          this.metricsSubject.next(metrics);
          this.transactionsSubject.next(transactions);
        },
        error: (error) => {
          console.error('Subscription error:', error);
          this.error$.next('An unexpected error occurred.');
          this.metricsSubject.next([]);
          this.transactionsSubject.next([]);
        },
      });
  }
}
