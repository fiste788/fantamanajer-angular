import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appMainTransition]',
  standalone: true,
})
export class MainTransitionDirective {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #transitionService = inject(CurrentTransitionService);

  public outletType = input.required<'root' | 'last'>({ alias: 'appMainTransition' });
  public outlet = input<RouterOutlet>();

  constructor() {
    effect(() => {
      const outletType = this.outletType();
      if (outletType) {
        const isTransitioning =
          outletType === 'last'
            ? this.#transitionService.isLastOutlet(this.outlet()!)
            : this.#transitionService.isRootOutlet();
        this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? 'main' : '';
      }
    });
  }
}
