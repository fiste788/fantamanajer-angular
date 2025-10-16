import { Directive, ElementRef, effect, inject, input } from '@angular/core';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appListToDetailTransition]',
  standalone: true,
})
export class ListToDetailTransitionDirective {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #transitionService = inject(CurrentTransitionService);

  public name = input.required<string>({ alias: 'appListToDetailTransition' });

  constructor() {
    effect(() => {
      const isTransitioning = this.#transitionService.isListToDetail();
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? this.name() : '';
    });
  }
}
