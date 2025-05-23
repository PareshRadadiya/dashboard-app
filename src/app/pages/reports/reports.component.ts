import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="reports-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Reports</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Reports and analytics will be displayed here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .reports-container {
        padding: 20px;
      }

      mat-card {
        max-width: 800px;
        margin: 0 auto;
      }
    `,
  ],
})
export class ReportsComponent {}
