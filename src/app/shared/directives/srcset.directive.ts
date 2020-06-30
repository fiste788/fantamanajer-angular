import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSrcset]',
})
export class SrcsetDirective implements OnInit, OnChanges {
  @Input() public appSrcset: Record<string, string> | string | null;
  @Input() public placeholder: string;

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef<HTMLImageElement>,
  ) { }

  public ngOnInit(): void {
    this.init();
  }

  public ngOnChanges(): void {
    this.init();
  }

  public init(): void {
    if (this.appSrcset !== null) {
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
    const srcset: Array<string> = [];
    const keys = Object.keys(set);
    keys.forEach((key) => {
      srcset.push(`${set[key]} ${key}`);

    });
    const lastKey = keys.pop();
    if (lastKey) {
      const src = set[lastKey];
      const width = +lastKey.substring(0, lastKey.indexOf('w'));
      if (this.el.nativeElement.sizes === '') {
        this.renderer.setStyle(this.el.nativeElement, 'sizes', `(max-width:${width}px) 100vw, ${width}px`);
      }
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
      this.renderer.setAttribute(this.el.nativeElement, 'srcset', srcset.join(','));
    }
  }
}
