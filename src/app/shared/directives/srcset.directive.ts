import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[fmSrcset]'
})
export class SrcsetDirective implements OnInit {
  @Input() public fmSrcset: any;
  @Input() public placeholder: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.fmSrcset) {
      if (typeof this.fmSrcset !== 'string') {
        const srcset: string[] = [];
        const keys = Object.keys(this.fmSrcset);
        keys.forEach(key => {
          srcset.push(this.fmSrcset[key] + ' ' + key);
        });
        const lastKey = keys.pop();
        if (lastKey) {
          const src = this.fmSrcset[lastKey];
          const width = parseInt(lastKey.substring(0, lastKey.indexOf('w')), 10);
          if (this.el.nativeElement.sizes === '') {
            this.el.nativeElement.sizes = '(max-width: ' + width + 'px) 100vw, ' + width + 'px';
          }
          this.el.nativeElement.src = src;
          /*this.el.nativeElement.sizes =
            '(max-width: ' + width + 'px) 100vw, ' + width + 'px';*/
          this.el.nativeElement.srcset = srcset.join(',');
        }
      }
    } else {
      this.el.nativeElement.src = this.placeholder;
    }
  }
}
