import { Directive, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';

import { ApplicationService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective implements OnInit {
  readonly #templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  // Renamed injected service for clarity
  readonly #applicationService = inject(ApplicationService);

  public ngOnInit(): void {
    // Using the renamed service
    if (this.#applicationService.seasonStarted() && !this.#applicationService.seasonEnded()) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
