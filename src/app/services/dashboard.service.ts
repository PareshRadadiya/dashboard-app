import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ChartData {
  labels: string[];
  values: number[];
  current?: number[];
  previous?: number[];
  target?: number;
  colors?: string[];
}

export interface Card {
  id: number;
  title: string;
  value: string;
  description: string;
  timeFrame: string;
  chartType: 'line' | 'bar' | 'area' | 'donut' | 'sparkline';
  icon: string;
  chartData: ChartData;
  trend: string;
  comparisonLabel: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Cards endpoints
  getCards(): Observable<Card[]> {
    console.log('Fetching cards from:', `${this.apiUrl}/cards`);
    return this.http.get<Card[]>(`${this.apiUrl}/cards`).pipe(
      map((cards) => {
        console.log('Raw cards data from API:', JSON.stringify(cards, null, 2));
        return cards.map((card) => {
          console.log(`Processing card: ${card.title}`, {
            originalChartData: card.chartData,
          });

          const transformedCard = {
            ...card,
            chartData: {
              labels: card.chartData?.labels || [],
              values: card.chartData?.values || [],
              previous: card.chartData?.previous || [],
              target: card.chartData?.target,
              colors: card.chartData?.colors || [
                '#1976d2',
                '#2196f3',
                '#64b5f6',
                '#90caf9',
              ],
            },
          };

          console.log(`Transformed card: ${card.title}`, {
            transformedChartData: transformedCard.chartData,
          });

          return transformedCard;
        });
      }),
      map((cards) => {
        console.log('Final transformed cards:', JSON.stringify(cards, null, 2));
        return cards;
      }),
      catchError((error) => {
        console.error('Error in getCards:', error);
        throw error;
      })
    );
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/cards/${id}`);
  }

  // Transactions endpoints
  getTransactions(params?: TransactionQueryParams): Observable<Transaction[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof TransactionQueryParams];
        if (value !== undefined && value !== null && value !== '') {
          // Handle search parameter for json-server
          if (key === 'search') {
            httpParams = httpParams.set('q', value.toString());
          } else if (key === 'sort' && params.order) {
            // Handle sorting for json-server
            httpParams = httpParams.set('_sort', value.toString());
            httpParams = httpParams.set('_order', params.order);
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    console.log('API Request URL:', `${this.apiUrl}/transactions`, {
      params: httpParams,
    }); // Debug log

    return this.http
      .get<Transaction[]>(`${this.apiUrl}/transactions`, { params: httpParams })
      .pipe(
        map((response) => {
          console.log('API Response:', response); // Debug log
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http
      .get<Transaction>(`${this.apiUrl}/transactions/${id}`)
      .pipe(catchError(this.handleError));
  }

  addTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Observable<Transaction> {
    return this.http
      .post<Transaction>(`${this.apiUrl}/transactions`, transaction)
      .pipe(catchError(this.handleError));
  }

  updateTransaction(
    id: number,
    transaction: Partial<Transaction>
  ): Observable<Transaction> {
    return this.http
      .patch<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction)
      .pipe(catchError(this.handleError));
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/transactions/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get transaction statistics
  getTransactionStats(): Observable<any> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`).pipe(
      map((transactions) => this.calculateStats(transactions)),
      catchError(this.handleError)
    );
  }

  // Calculate transaction statistics
  private calculateStats(transactions: Transaction[]) {
    const total = transactions.reduce((acc, curr) => {
      return curr.type === 'credit' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const stats = {
      total,
      count: transactions.length,
      credits: transactions.filter((t) => t.type === 'credit').length,
      debits: transactions.filter((t) => t.type === 'debit').length,
      completed: transactions.filter((t) => t.status === 'completed').length,
      pending: transactions.filter((t) => t.status === 'pending').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
    };

    return stats;
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
