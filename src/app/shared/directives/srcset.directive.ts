import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[fmSrcset]'
})
export class SrcsetDirective implements OnInit, OnChanges {
  @Input() fmSrcset: Record<string, string> | string | null;
  @Input() placeholder: string;

  constructor(private readonly el: ElementRef<HTMLImageElement>) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(): void {
    this.init();
  }

  init(): void {
    if (this.fmSrcset !== null) {
      if (typeof this.fmSrcset !== 'string') {
        const srcset: Array<string> = [];
        const keys = Object.keys(this.fmSrcset);
        keys.forEach(key => {
          if (this.fmSrcset !== null) {
            srcset.push(`${this.fmSrcset[key]} ${key}`);
          }
        });
        const lastKey = keys.pop();
        if (lastKey) {
          const src = this.fmSrcset[lastKey];
          const width = parseInt(lastKey.substring(0, lastKey.indexOf('w')), 10);
          if (this.el.nativeElement.sizes === '') {
            this.el.nativeElement.sizes = `(max-width:${width}px) 100vw, ${width}px`;
          }
          this.el.nativeElement.src = src;
          this.el.nativeElement.srcset = srcset.join(',');
        }
      }
    } else {
      this.el.nativeElement.src = this.placeholder;
    }
  }
}
