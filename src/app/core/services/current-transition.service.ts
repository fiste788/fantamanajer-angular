import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';
import { MatTabNav } from '@angular/material/tabs';
import { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CurrentTransitionService {
  // eslint-disable-next-line unicorn/no-useless-undefined
  public readonly currentTransition = signal<ViewTransitionInfo | undefined>(undefined);

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  public getViewTransitionName(transitionName: string, entity: { id: number }, param = 'id') {
    const transition = this.currentTransition();
    // If we're transitioning to or from the cat's detail page, add the `banner-image` transition name.
    // This allows the browser to animate between the specific cat image from the list and its image on the detail page.
    const isBannerImg =
      this.getOutlet(transition?.to)?.firstChild?.params[param] === `${entity.id}` ||
      this.getOutlet(transition?.from)?.firstChild?.params[param] === `${entity.id}`;

    if (isBannerImg) {
      this.document.documentElement.classList.remove('list-to-detail');
      this.document.documentElement.classList.add('detail-to-list');
    }

    return isBannerImg ? transitionName : '';
  }

  public isOutletChanged(transitionName: string, param = 'id') {
    const transition = this.currentTransition();
    // If we're transitioning to or from the cat's detail page, add the `banner-image` transition name.
    // This allows the browser to animate between the specific cat image from the list and its image on the detail page.
    const isBannerImg =
      this.getOutlet(transition?.to)?.firstChild?.params[param] !==
      this.getOutlet(transition?.from)?.firstChild?.params[param];

    if (isBannerImg) {
      this.document.documentElement.classList.remove('detail-to-list');
      this.document.documentElement.classList.add('list-to-detail');
    }

    return isBannerImg ? transitionName : '';
  }

  public isTabChanged(tabBar?: MatTabNav): boolean {
    const transition = this.currentTransition();
    const outletFrom = this.getOutlet(transition?.from);
    const outletTo = this.getOutlet(transition?.to);
    let isSameContext = outletFrom?.data['state'] === outletTo?.data['state'];

    if (isSameContext && outletTo?.firstChild?.data['exit'] === true) {
      isSameContext = false;
    }
    console.log(outletFrom, outletTo);
    if (isSameContext && tabBar) {
      const el = tabBar._tabList.nativeElement as HTMLDivElement;
      // eslint-disable-next-line unicorn/prefer-spread
      const tabs = Array.from(el.querySelectorAll('a'));
      const from = this.getUrl(transition?.from);
      const to = this.getUrl(transition?.to);

      console.log(from, to);
      if (from && to) {
        const pre = from ? tabs.findIndex((a) => a.pathname.startsWith(`/${from}`)) : -1;
        const post = to ? tabs.findIndex((a) => a.pathname.startsWith(`/${to}`)) : -1;
        if (pre > -1 && post > -1) {
          if (pre > post) {
            this.document.documentElement.classList.remove('direction-left');
            this.document.documentElement.classList.add('direction-right');
          } else {
            this.document.documentElement.classList.remove('direction-right');
            this.document.documentElement.classList.add('direction-left');
          }
        }
      }
    } else {
      this.document.documentElement.classList.remove('direction-left', 'direction-right');
    }

    return isSameContext;

    // return outlet.isActivated ? transitionName : '';
  }

  private getOutlet(route?: ActivatedRouteSnapshot): ActivatedRouteSnapshot | undefined {
    if (route) {
      const state = route?.data['state'] as string | undefined;

      return state?.endsWith('-outlet') ? route : this.getOutlet(route.firstChild ?? undefined);
    }

    return undefined;
  }

  private getUrl(route?: ActivatedRouteSnapshot): string | undefined {
    const outlet = this.getOutlet(route);
    const child = outlet?.firstChild?.firstChild ?? outlet?.firstChild;

    return child?.pathFromRoot
      ?.map((entry) => entry.url[0])
      .filter((entry) => entry !== undefined)
      .join('/');
  }
}
