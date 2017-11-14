import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[fmSrcset]'
})
export class SrcsetDirective implements OnInit {
  @Input('fmSrcset') public image: any;
  @Input() public placeholder: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.image) {
      if (typeof this.image !== 'string') {
        const srcset = [];
        const keys = Object.keys(this.image);
        keys.forEach(key => {
          srcset.push(this.image[key] + ' ' + key);
        });
        const lastKey = keys.pop();
        const src = this.image[lastKey];
        const width = parseInt(lastKey.substring(0, lastKey.indexOf('w')), 10);
        this.el.nativeElement.src = src;
        /*this.el.nativeElement.sizes =
          '(max-width: ' + width + 'px) 100vw, ' + width + 'px';*/
        this.el.nativeElement.srcset = srcset.join(',');
      }
    } else {
      this.el.nativeElement.src = this.placeholder;
    }
  }
}
