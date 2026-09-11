import type { UrlTree } from '@angular/router';

export interface NavigationItem {
  divider?: boolean;
  exact?: boolean;
  header?: string;
  icon: string;
  title: string;
  title_short?: string;
  url: string | unknown[] | UrlTree;
}
