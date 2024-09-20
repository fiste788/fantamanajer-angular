/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/no-useless-undefined */

import { DOCUMENT } from '@angular/common';
import { Injectable, signal, inject } from '@angular/core';
import { MatTabNav } from '@angular/material/tabs';
import { ActivatedRouteSnapshot, RouterOutlet, UrlTree, ViewTransitionInfo } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CurrentTransitionService {
  readonly #document = inject<Document>(DOCUMENT);

  public readonly currentTransition = signal<
    | {
        transition: ViewTransitionInfo;
        previousUrl?: UrlTree;
        finalUrl?: UrlTree;
      }
    | undefined
  >(undefined);

  public getViewTransitionName(
    transitionName: string,
    entity: {
      id: number;
    },
    param = 'id',
  ) {
    const info = this.currentTransition();
    if (info) {
      // If we're transitioning to or from the cat's detail page, add the `banner-image` transition name.
      // This allows the browser to animate between the specific cat image from the list and its image on the detail page.
      const isBannerImg =
        this.#getOutlet(info.transition?.to)?.firstChild?.params[param] === `${entity.id}` ||
        this.#getOutlet(info.transition?.from)?.firstChild?.params[param] === `${entity.id}`;

      if (isBannerImg) {
        this.#document.documentElement.classList.remove('list-to-detail');
        this.#document.documentElement.classList.add('detail-to-list');
      }

      return isBannerImg ? transitionName : '';
    }

    return '';
  }

  public isOutletChanged(transitionName: string, param = 'id'): string {
    const info = this.currentTransition();
    // If we're transitioning to or from the cat's detail page, add the `banner-image` transition name.
    // This allows the browser to animate between the specific cat image from the list and its image on the detail page.
    if (info) {
      const outletTo = this.#getOutlet(info.transition?.to);
      const outletFrom = this.#getOutlet(info.transition?.from);
      if (
        outletFrom?.data['state'] === outletTo?.data['state'] ||
        outletFrom?.data['state'] === outletTo?.data['viewTransitionOutlet'] ||
        outletTo?.data['state'] === outletFrom?.data['viewTransitionOutlet']
      ) {
        const isBannerImg =
          this.#getOutlet(info.transition?.to)?.firstChild?.params[param] !==
          this.#getOutlet(info.transition?.from)?.firstChild?.params[param];

        if (isBannerImg) {
          this.#document.documentElement.classList.remove('detail-to-list');
          this.#document.documentElement.classList.add('list-to-detail');
        }

        return isBannerImg ? transitionName : '';
      }
    }

    return '';
  }

  public isTabChanged(tabBar?: MatTabNav): boolean {
    const info = this.currentTransition();
    if (info) {
      const outletFrom = this.#getOutlet(info?.transition?.from);
      const outletTo = this.#getOutlet(info?.transition?.to);
      let isSameContext = outletFrom?.data['state'] === outletTo?.data['state'];

      if (isSameContext && outletTo?.firstChild?.data['exit'] === true) {
        isSameContext = false;
      }

      if (tabBar) {
        const el = tabBar._tabList.nativeElement as HTMLDivElement;

        const tabs = Array.from(el.querySelectorAll('a'));
        const from = this.#getUrl(info?.transition?.from);
        const to = this.#getUrl(info?.transition?.to);

        const pre = from ? tabs.findIndex((a) => a.pathname.startsWith(`/${from}`)) : -1;
        const post = to ? tabs.findIndex((a) => a.pathname.startsWith(`/${to}`)) : -1;
        if (pre > -1 && post > -1) {
          if (pre > post) {
            this.#document.documentElement.classList.add('direction-right');
          } else {
            this.#document.documentElement.classList.add('direction-left');
          }
        }
      }

      return isSameContext;
    }

    return true;
    // return outlet.isActivated ? transitionName : '';
  }

  public isRootOutlet(): boolean {
    const info = this.currentTransition();

    if (info) {
      const outletFrom = this.#getOutlet(info?.transition?.from);
      const outletTo = this.#getOutlet(info?.transition?.to);

      return outletFrom === undefined && outletTo === undefined
        ? false
        : outletFrom === undefined || outletTo === undefined;
    }

    return false;
  }

  public isLastOutlet(o: RouterOutlet): boolean {
    const info = this.currentTransition();

    if (info) {
      let outletFrom = this.#getOutlet(info?.transition?.from);
      while (this.#getOutlet(outletFrom) !== undefined) {
        outletFrom = this.#getOutlet(outletFrom)?.firstChild ?? undefined;
      }

      let outletTo = this.#getOutlet(info?.transition?.to);
      while (this.#getOutlet(outletTo) !== undefined) {
        outletTo = this.#getOutlet(outletTo)?.firstChild ?? undefined;
      }

      return outletFrom?.component === o.component || outletTo?.component === o.component;
    }

    return false;
  }

  #getOutlet(route?: ActivatedRouteSnapshot): ActivatedRouteSnapshot | undefined {
    if (route) {
      const state = route?.data['state'] as string | undefined;

      return state?.endsWith('-outlet') ? route : this.#getOutlet(route.firstChild ?? undefined);
    }

    return undefined;
  }

  #getUrl(route?: ActivatedRouteSnapshot): string | undefined {
    const outlet = this.#getOutlet(route);
    const child = outlet?.firstChild?.firstChild ?? outlet?.firstChild;

    return child?.pathFromRoot
      ?.map((entry) => entry.url[0])
      .filter((entry) => entry !== undefined)
      .join('/');
  }
}
