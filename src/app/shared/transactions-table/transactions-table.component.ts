import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DashboardService,
  Transaction,
} from '../../services/dashboard.service';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() transactions: Transaction[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'description', 'amount', 'status'];
  dataSource = new MatTableDataSource<Transaction>([]);
  selectedRow: Transaction | null = null;
  private destroy$ = new Subject<void>();
  isLoading = false;
  totalTransactions = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25];
  sortField = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions'] && changes['transactions'].currentValue) {
      this.dataSource.data = this.transactions;
      this.totalTransactions = this.transactions.length;
      this.setupDataSource();
    }
  }

  ngOnInit() {
    if (this.transactions.length === 0) {
      this.loadTransactions();
    }
  }

  ngAfterViewInit() {
    this.setupDataSource();
    if (this.sort) {
      this.sort.active = this.sortField;
      this.sort.direction = this.sortDirection;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransactions() {
    this.isLoading = true;
    this.dashboardService
      .getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.dataSource.data = transactions;
          this.totalTransactions = transactions.length;
          this.setupDataSource();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.snackBar.open(
            'Error loading transactions. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            }
          );
          this.isLoading = false;
        },
      });
  }

  setupDataSource() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = this.currentPage;
    }

    // Filter predicate for status filtering
    this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
      return !filter || data.status === filter;
    };
  }

  applyStatusFilter(event: MatSelectChange) {
    this.dataSource.filter = event.value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getTotalAmount(): number {
    return this.dataSource.data.reduce((total, item) => {
      const amount = parseFloat(item.amount.toString());
      return total + (item.type === 'credit' ? amount : -amount);
    }, 0);
  }

  selectRow(row: Transaction) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }
}
