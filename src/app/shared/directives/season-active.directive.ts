import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { ApplicationService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective implements OnInit, OnDestroy {
  readonly #templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  readonly #app = inject(ApplicationService);
  readonly #subscriptions = new Subscription();

  public ngOnInit(): void {
    this.#subscriptions.add(
      this.#app.requireTeam$
        .pipe(
          tap(() => {
            if (this.#app.seasonStarted() && !this.#app.seasonEnded()) {
              this.#viewContainer.createEmbeddedView(this.#templateRef);
            } else {
              this.#viewContainer.clear();
            }
          }),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
