import { inject } from '@angular/core';
import { ViewTransitionInfo } from '@angular/router';

import { CurrentTransitionService } from '@app/services/current-transition.service';

export function onViewTransitionCreated(info: ViewTransitionInfo) {
  const currentTransitionService = inject(CurrentTransitionService);
  currentTransitionService.currentTransition.set(info);
  // Update current transition when animation finishes
  void info.transition.finished.finally(() => {
    currentTransitionService.currentTransition.set(undefined);
  });
}
