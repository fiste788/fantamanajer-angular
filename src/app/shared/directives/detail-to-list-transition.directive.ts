import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appDetailToListTransition]',
  standalone: true,
})
export class DetailToListTransitionDirective {

  readonly #transitionService = inject(CurrentTransitionService);

  public readonly entity = input<{ id: number }>();
  public readonly name = input.required<string>({ alias: 'appDetailToListTransition' });

  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const entity = this.entity();
      const isTransitioning = entity ? this.#transitionService.isDetailToList(entity) : false;
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? this.name() : '';
    });
  }

}
