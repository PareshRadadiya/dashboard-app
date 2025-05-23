import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  toggleTheme(): void {
    this.isDarkMode.next(!this.isDarkMode.value);
    if (this.isDarkMode.value) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  getCurrentTheme(): boolean {
    return this.isDarkMode.value;
  }
}
