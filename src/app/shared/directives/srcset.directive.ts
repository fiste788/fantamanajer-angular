import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSrcset]',
})
export class SrcsetDirective implements OnInit, OnChanges {
  @Input() public appSrcset?: Record<string, string> | string | null;
  @Input() public placeholder = '';

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef<HTMLImageElement>,
  ) {}

  public ngOnInit(): void {
    this.init();
  }

  public ngOnChanges(): void {
    this.init();
  }

  public init(): void {
    if (this.appSrcset !== null && this.appSrcset !== undefined) {
      if (typeof this.appSrcset !== 'string') {
        this.processRecord(this.appSrcset);
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'srcset', this.appSrcset);
      }
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'src', this.placeholder);
    }
  }

  public processRecord(set: Record<string, string>): void {
    const entries = Object.entries(set);
    const srcset = entries.map(([k, v]) => `${v} ${k}`);
    const lastEntry = entries.pop();
    if (lastEntry) {
      const [key, src] = lastEntry;
      const width = +key.slice(0, Math.max(0, key.indexOf('w')));
      if (this.el.nativeElement.sizes === '') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'sizes',
          `(max-width:${width}px) 100vw, ${width}px`,
        );
      }
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
      this.renderer.setAttribute(this.el.nativeElement, 'srcset', srcset.join(','));
    }
  }
}
