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
  colors?: string[];
}

export interface Card {
  id: string;
  title: string;
  value: string;
  description: string;
  timeFrame: string;
  chartType: 'line' | 'bar';
  icon: string;
  chartData: ChartData;
  trend?: string;
  comparisonLabel?: string;
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
    return this.http.get<Card[]>(`${this.apiUrl}/cards`).pipe(
      map((cards) => {
        return cards.map((card) => ({
          ...card,
          chartData: {
            labels: card.chartData?.labels || [],
            values: card.chartData?.values || [],
            colors: card.chartData?.colors || ['#1976d2', '#2196f3', '#64b5f6', '#90caf9'],
          },
        }));
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

    return this.http
      .get<Transaction[]>(`${this.apiUrl}/transactions`, { params: httpParams })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
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
