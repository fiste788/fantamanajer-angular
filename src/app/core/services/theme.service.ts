import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark$: Observable<boolean> = this.breakpointObserver.observe('(prefers-color-scheme: dark)').pipe(map(result => result.matches));

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  connect() {
    this.isDark$.subscribe(dark => this.setTheme(dark));
  }

  setTheme(isDark: boolean) {
    this.loadStyle((isDark ? 'dark' : 'light') + '-theme.css');
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    const themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}
