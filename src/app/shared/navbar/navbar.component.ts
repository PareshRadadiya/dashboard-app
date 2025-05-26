import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { ThemeService } from '../services/theme.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobileMenuOpen = false;
  isMobile = false;
  isCollapsed = false;

  constructor(
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result) => result.matches))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
        if (isMobile) {
          this.isCollapsed = false;
          this.sidenav?.close();
        } else {
          this.sidenav?.open();
        }
      });
  }

  get isDarkMode$() {
    return this.themeService.isDarkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }

  closeMobileMenu(): void {
    if (this.isMobile) {
      this.sidenav.close();
      this.isMobileMenuOpen = false;
    }
  }

  toggleSidebar(): void {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  logout(): void {
    // Implement logout logic here
  }
}
