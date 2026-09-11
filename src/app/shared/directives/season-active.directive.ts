import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';

import { AppService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective {

  // Renamed injected service for clarity
  readonly #applicationService = inject(AppService);
  readonly #viewContainer = inject(ViewContainerRef);

  readonly #templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  constructor() {
    effect(() => {
      if (this.#applicationService.seasonStarted() && !this.#applicationService.seasonEnded()) {
        this.#viewContainer.createEmbeddedView(this.#templateRef);
      } else {
        this.#viewContainer.clear();
      }
    });
  }

}
