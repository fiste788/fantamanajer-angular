import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { CurrentTransitionService } from '@app/services';

@Directive({
  selector: '[appTabChangedTransition]',
  standalone: true,
})
export class TabChangedTransitionDirective {
  readonly #transitionService = inject(CurrentTransitionService);

  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public readonly name = input.required<string>({ alias: 'appTabChangedTransition' });
  public readonly tabBar = input<ElementRef<HTMLElement>>();

  constructor() {
    effect(() => {
      const tabBar = this.tabBar();
      const isTransitioning = tabBar ? this.#transitionService.isTabChanged(tabBar.nativeElement) : !this.#transitionService.isTabChanged();
      this.#elementRef.nativeElement.style.viewTransitionName = isTransitioning ? this.name() : '';
    });
  }
}
