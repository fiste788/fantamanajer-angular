import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSticky]',
  standalone: true,
})
export class StickyDirective implements AfterViewInit {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    private readonly el?: ElementRef,
  ) {}

  public ngAfterViewInit(): void {
    if (this.el !== undefined) {
      const height =
        this.document.querySelector('app-toolbar > .mat-toolbar.mat-primary')?.clientHeight ?? 0;
      this.renderer.addClass(this.el.nativeElement, 'sticky');
      this.renderer.setStyle(this.el.nativeElement, 'top', `${height}px`);
    }
  }
}
