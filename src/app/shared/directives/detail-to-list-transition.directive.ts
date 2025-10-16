import { Directive, ElementRef, effect, inject, input } from '@angular/core';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appDetailToListTransition]',
  standalone: true,
})
export class DetailToListTransitionDirective {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #transitionService = inject(CurrentTransitionService);

  public name = input.required<string>({ alias: 'appDetailToListTransition' });
  public entity = input<{ id: number }>();

  constructor() {
    effect(() => {
      const entity = this.entity();
      const isTransitioning = entity ? this.#transitionService.isDetailToList(entity) : false;
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? this.name() : '';
    });
  }
}
