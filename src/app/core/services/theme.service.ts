import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark$: Observable<boolean> = this.breakpointObserver.observe('(prefers-color-scheme: dark)')
    .pipe(map(result => result.matches));

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly breakpointObserver: BreakpointObserver
  ) {
  }

  connect(): void {
    this.isDark$.subscribe(dark => {
      this.setTheme(dark);
    });
  }

  setTheme(isDark: boolean): void {
    this.loadStyle(`${isDark ? 'dark' : 'light'}-theme.css`);
  }

  loadStyle(styleName: string): void {
    const head = this.document.getElementsByTagName('head')[0];

    const themeLink = this.document.getElementById('client-theme');
    if (themeLink !== null) {
      (themeLink as HTMLLinkElement).href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = styleName;

      head.appendChild(style);
    }
  }
}
