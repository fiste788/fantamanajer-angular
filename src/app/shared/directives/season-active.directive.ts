import { Directive, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';

import { ApplicationService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective implements OnInit {
  readonly #templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  readonly #app = inject(ApplicationService);

  public ngOnInit(): void {
    if (this.#app.seasonStarted() && !this.#app.seasonEnded()) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
