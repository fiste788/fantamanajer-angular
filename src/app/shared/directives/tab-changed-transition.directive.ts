import { Directive, ElementRef, effect, inject, input } from '@angular/core';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appTabChangedTransition]',
  standalone: true,
})
export class TabChangedTransitionDirective {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #transitionService = inject(CurrentTransitionService);

  public name = input.required<string>({ alias: 'appTabChangedTransition' });
  public tabBar = input<ElementRef<HTMLElement>>();

  constructor() {
    effect(() => {
      const tabBar = this.tabBar();
      const isTransitioning = tabBar
        ? this.#transitionService.isTabChanged(tabBar.nativeElement)
        : !this.#transitionService.isTabChanged();
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? this.name() : '';
    });
  }
}
