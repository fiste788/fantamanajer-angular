import { afterNextRender, Directive, DOCUMENT, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSticky]',
  standalone: true,
})
export class StickyDirective {

  readonly #document = inject<Document>(DOCUMENT);
  // Renamed private member for clarity
  readonly #elementRef = inject(ElementRef, { optional: true });
  readonly #renderer = inject(Renderer2);

  constructor() {
    afterNextRender(() => {
      if (this.#elementRef === null) {
        return;
      }

      // Updated private member name
      // Consider refactoring this DOM query for better coupling
      const height = this.#document.querySelector(':scope > app-toolbar > .mat-toolbar.mat-primary')?.clientHeight ?? 0;
      // Updated private member name
      this.#renderer.addClass(this.#elementRef.nativeElement, 'sticky');
      // Updated private member name
      this.#renderer.setStyle(this.#elementRef.nativeElement, 'top', `${height}px`);
    });
  }

}
