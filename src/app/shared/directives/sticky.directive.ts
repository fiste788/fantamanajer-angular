import { Directive, ElementRef, Renderer2, afterNextRender, inject, DOCUMENT } from '@angular/core';

@Directive({
  selector: '[appSticky]',
  standalone: true,
})
export class StickyDirective {
  readonly #document = inject<Document>(DOCUMENT);
  readonly #renderer = inject(Renderer2);
  readonly #ref = inject(ElementRef, { optional: true });

  constructor() {
    afterNextRender(() => {
      if (this.#ref !== null) {
        const height =
          this.#document.querySelector('app-toolbar > .mat-toolbar.mat-primary')?.clientHeight ?? 0;
        this.#renderer.addClass(this.#ref.nativeElement, 'sticky');
        this.#renderer.setStyle(this.#ref.nativeElement, 'top', `${height}px`);
      }
    });
  }
}
