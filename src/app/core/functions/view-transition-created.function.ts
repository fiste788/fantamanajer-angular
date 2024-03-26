import { inject } from '@angular/core';
import { IsActiveMatchOptions, Router, ViewTransitionInfo } from '@angular/router';

import { CurrentTransitionService } from '@app/services/current-transition.service';

export function onViewTransitionCreated(info: ViewTransitionInfo) {
  const currentTransitionService = inject(CurrentTransitionService);
  const router = inject(Router);
  const currentNavigation = router.getCurrentNavigation();
  const targetUrl = currentNavigation!.finalUrl!;
  // Skip the transition if the only thing
  // changing is the fragment and queryParams
  const config: IsActiveMatchOptions = {
    paths: 'exact',
    matrixParams: 'exact',
    fragment: 'ignored',
    queryParams: 'ignored',
  };

  if (router.isActive(targetUrl, config)) {
    info.transition.skipTransition();
  } else {
    currentTransitionService.currentTransition.set({
      transition: info,
      previousUrl: currentNavigation?.previousNavigation?.finalUrl,
      finalUrl: currentNavigation?.finalUrl,
    });
    // Update current transition when animation finishes
    void info.transition.finished.finally(() => {
      currentTransitionService.currentTransition.set(undefined);
      document.documentElement.classList.remove(
        'direction-left',
        'direction-right',
        'list-to-detail',
        'detail-to-list',
      );
    });
  }
}
