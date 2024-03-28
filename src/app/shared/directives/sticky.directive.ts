import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Renderer2, afterNextRender } from '@angular/core';

@Directive({
  selector: '[appSticky]',
  standalone: true,
})
export class StickyDirective {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    private readonly el?: ElementRef,
  ) {
    afterNextRender(() => {
      if (this.el !== undefined) {
        const height =
          this.document.querySelector('app-toolbar > .mat-toolbar.mat-primary')?.clientHeight ?? 0;
        this.renderer.addClass(this.el.nativeElement, 'sticky');
        this.renderer.setStyle(this.el.nativeElement, 'top', `${height}px`);
      }
    });
  }
}
