import { Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CurrentTransitionService {
  // eslint-disable-next-line unicorn/no-useless-undefined
  public readonly currentTransition = signal<ViewTransitionInfo | undefined>(undefined);

  public getViewTransitionName(entity: { id: number }, param = 'id') {
    const transition = this.currentTransition();
    // If we're transitioning to or from the cat's detail page, add the `banner-image` transition name.
    // This allows the browser to animate between the specific cat image from the list and its image on the detail page.
    const isBannerImg =
      this.getOutlet(transition?.to)?.firstChild?.params[param] === `${entity.id}` ||
      this.getOutlet(transition?.from)?.firstChild?.params[param] === `${entity.id}`;

    return isBannerImg ? 'banner-img' : '';
  }

  private getOutlet(route?: ActivatedRouteSnapshot): ActivatedRouteSnapshot | undefined {
    if (route) {
      const state = route?.data['state'] as string | undefined;

      return state?.endsWith('-outlet') ? route : this.getOutlet(route.firstChild ?? undefined);
    }

    return undefined;
  }
}
