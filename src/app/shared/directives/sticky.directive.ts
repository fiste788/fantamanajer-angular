import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[fmSticky]'
})
export class StickyDirective implements OnInit {

  constructor(
    private readonly el: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document) { }

  ngOnInit(): void {
    if (this.el !== undefined) {
      const height = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary')?.clientHeight;
      this.el.nativeElement.classList.add('sticky');
      this.el.nativeElement.style.top = `${height}px`;
    }
  }
}
