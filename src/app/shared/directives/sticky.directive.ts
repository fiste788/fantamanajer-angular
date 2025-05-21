import { Directive, ElementRef, Renderer2, afterNextRender, inject, DOCUMENT } from '@angular/core';

@Directive({
  selector: '[appSticky]',
  standalone: true,
})
export class StickyDirective {
  readonly #document = inject<Document>(DOCUMENT);
  readonly #renderer = inject(Renderer2);
  readonly #el = inject(ElementRef, { optional: true });

  constructor() {
    afterNextRender(() => {
      if (this.#el !== null) {
        const height =
          this.#document.querySelector('app-toolbar > .mat-toolbar.mat-primary')?.clientHeight ?? 0;
        this.#renderer.addClass(this.#el.nativeElement, 'sticky');
        this.#renderer.setStyle(this.#el.nativeElement, 'top', `${height}px`);
      }
    });
  }
}
