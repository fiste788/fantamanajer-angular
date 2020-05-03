import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[fmSrcset]'
})
export class SrcsetDirective implements OnInit, OnChanges {
  @Input() fmSrcset: Record<string, string> | string | null;
  @Input() placeholder: string;

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef<HTMLImageElement>
  ) { }

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
          const width = +lastKey.substring(0, lastKey.indexOf('w'));
          if (this.el.nativeElement.sizes === '') {
            this.renderer.setStyle(this.el.nativeElement, 'sizes', `(max-width:${width}px) 100vw, ${width}px`);
          }
          this.renderer.setAttribute(this.el.nativeElement, 'src', src);
          this.renderer.setAttribute(this.el.nativeElement, 'srcset', srcset.join(','));
        }
      }
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'src', this.placeholder);
    }
  }
}
