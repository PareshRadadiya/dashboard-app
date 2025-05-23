import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Settings page content goes here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding: 20px;
      }

      mat-card {
        max-width: 800px;
        margin: 0 auto;
      }
    `,
  ],
})
export class SettingsComponent {}
