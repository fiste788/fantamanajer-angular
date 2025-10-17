import { Directive, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';

import { ApplicationService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective {
  readonly #templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  // Renamed injected service for clarity
  readonly #applicationService = inject(ApplicationService);

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
