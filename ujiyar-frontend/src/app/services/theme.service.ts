import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('solace-theme', dark ? 'dark' : 'light');
    });
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('solace-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggle() {
    this.isDark.set(!this.isDark());
  }
}