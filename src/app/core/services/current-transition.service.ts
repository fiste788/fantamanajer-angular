/* eslint-disable unicorn/prefer-spread */

import { DOCUMENT } from '@angular/common';
import { Injectable, signal, inject, computed } from '@angular/core';
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

  readonly #transitionInfo = computed(() => {
    const transition = this.currentTransition();
    if (!transition) {
      return {
        transition: undefined,
        from: undefined,
        to: undefined,
        outletFrom: undefined,
        outletTo: undefined,
        targetFrom: undefined,
        targetTo: undefined,
      };
    }
    const { from, to } = transition.transition;
    const outletFrom = this.#getOutlet(from);
    const outletTo = this.#getOutlet(to);
    const targetFrom = outletFrom?.firstChild ?? outletFrom;
    const targetTo = outletTo?.firstChild ?? outletTo;

    return { transition, from, to, outletFrom, outletTo, targetFrom, targetTo };
  });

  public readonly isSameContext = computed(() => {
    const { outletFrom, outletTo } = this.#transitionInfo();
    if (!outletFrom || !outletTo) {
      return true;
    } // Default behavior

    let isSameContext = outletFrom.data['state'] === outletTo.data['state'];

    if (isSameContext && outletTo.firstChild?.data['exit'] === true) {
      isSameContext = false;
    }

    return isSameContext;
  });

  public readonly isRootOutlet = computed(() => {
    const { transition, outletFrom, outletTo } = this.#transitionInfo();
    if (!transition?.previousUrl) {
      return false;
    }

    return outletFrom === undefined || outletTo === undefined;
  });

  public isListToDetail(): boolean {
    const { outletFrom, outletTo, targetFrom, targetTo } = this.#transitionInfo();
    if (!outletFrom || !outletTo || !targetFrom || !targetTo) {
      return false;
    }

    const param = this.#getTransitionParam(outletFrom, outletTo);
    const fromId = targetFrom.params[param] as string | undefined;
    const toId = targetTo.params[param] as string | undefined;

    if (
      outletFrom?.data['state'] === outletTo?.data['state'] ||
      outletFrom?.data['state'] === outletTo?.data['viewTransitionOutlet'] ||
      outletTo?.data['state'] === outletFrom?.data['viewTransitionOutlet']
    ) {
      const isBannerImg = targetTo?.params[param] !== targetFrom?.params[param];

      if (isBannerImg && !fromId && toId) {
        this.#document.documentElement.classList.remove('detail-to-list');
        this.#document.documentElement.classList.add('list-to-detail');
      }

      return isBannerImg;
    }

    return false;
  }

  public isDetailToList(entity: { id: number }): boolean {
    const { outletFrom, outletTo, targetFrom, targetTo } = this.#transitionInfo();
    let isBannerImg = false;
    if (targetFrom || targetTo) {
      const param = this.#getTransitionParam(targetFrom, targetTo);
      isBannerImg =
        targetTo?.params[param] === `${entity.id}` || targetFrom?.params[param] === `${entity.id}`;
    }

    if (isBannerImg && outletFrom && outletTo && targetFrom && targetTo) {
      const param = this.#getTransitionParam(outletFrom, outletTo);
      const fromId = targetFrom.params[param] as string | undefined;
      const toId = targetTo.params[param] as string | undefined;
      if (fromId && !toId) {
        // It is a D2L transition
        this.#document.documentElement.classList.remove('list-to-detail');
        this.#document.documentElement.classList.add('detail-to-list');
      }
    }

    return isBannerImg;
  }

  public isTabChanged(tabBar?: HTMLElement): boolean {
    const info = this.currentTransition();
    if (info && tabBar) {
      const tabs = Array.from(tabBar.querySelectorAll('a'));
      const from = this.#getUrl(info.transition.from);
      const to = this.#getUrl(info.transition.to);

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

    return this.isSameContext();
  }

  public isLastOutlet(o: RouterOutlet): boolean {
    const { from, to } = this.#transitionInfo();

    if (from && o.isActivated) {
      let outletFrom = this.#getOutlet(from);
      while (this.#getOutlet(outletFrom) !== undefined) {
        outletFrom = this.#getOutlet(outletFrom)?.firstChild ?? undefined;
      }

      let outletTo = this.#getOutlet(to);
      while (this.#getOutlet(outletTo) !== undefined) {
        outletTo = this.#getOutlet(outletTo)?.firstChild ?? undefined;
      }

      return outletFrom?.component === o.component || outletTo?.component === o.component;
    }

    return false;
  }

  #getOutlet(route?: ActivatedRouteSnapshot): ActivatedRouteSnapshot | undefined {
    if (route) {
      const state = route.data['state'] as string | undefined;

      return state?.endsWith('-outlet') ? route : this.#getOutlet(route.firstChild ?? undefined);
    }

    return undefined;
  }

  #getUrl(route?: ActivatedRouteSnapshot): string | undefined {
    const outlet = this.#getOutlet(route);
    const child = outlet?.firstChild?.firstChild ?? outlet?.firstChild;

    return child?.pathFromRoot
      .map((entry) => entry.url[0])
      .filter((entry) => entry !== undefined)
      .join('/');
  }

  #getTransitionParam(
    outletFrom?: ActivatedRouteSnapshot,
    outletTo?: ActivatedRouteSnapshot,
  ): string {
    return (
      (outletFrom?.data['transitionParam'] as string | undefined) ??
      (outletTo?.data['transitionParam'] as string | undefined) ??
      'id'
    );
  }
}
