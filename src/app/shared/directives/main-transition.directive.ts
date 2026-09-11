import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import type { RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appMainTransition]',
  standalone: true,
})
export class MainTransitionDirective {

  readonly #transitionService = inject(CurrentTransitionService);

  public readonly outlet = input<RouterOutlet>();
  public readonly outletType = input.required<'last' | 'root'>({ alias: 'appMainTransition' });

  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const outletType = this.outletType();

      const isTransitioning = outletType === 'last'
        ? this.#transitionService.isLastOutlet(this.outlet()!)
        : this.#transitionService.isRootOutlet();
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? 'main' : '';
    });
  }

}
