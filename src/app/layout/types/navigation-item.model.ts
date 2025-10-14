import { UrlTree } from '@angular/router';

export interface NavigationItem {
  title: string;
  url: string | Array<unknown> | UrlTree;
  icon: string;
  exact?: boolean;
  title_short?: string;
  divider?: boolean;
  header?: string;
}
