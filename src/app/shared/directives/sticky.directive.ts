import { Directive, Input, ElementRef, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[fmSticky]'
})
export class StickyDirective implements OnInit {

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if (this.el) {
      const height = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary').clientHeight;
      this.el.nativeElement.classList.add('sticky');
      this.el.nativeElement.style.top = height + 'px';
    }
  }
}
