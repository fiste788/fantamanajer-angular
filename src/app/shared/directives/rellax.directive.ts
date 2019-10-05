import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  NgZone,
  HostBinding,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[fmRellax]'
})
export class RellaxDirective implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('style.will-change') will = 'transform';
  @HostBinding('style.transform') transform = 'translate3d(0,0,0)';
  @Input() speed = -2;
  @Input() center = false;
  @Input() percentage: number = null;
  @Input() relativeToWrapper = false;
  @Input() wrapper = '.mat-drawer-content';

  private options: any;
  private block: any;
  private posY = 0;
  private posX = 0;
  private pause = true;
  private subscription: Subscription;
  private loopId: number = null;
  private supportsPassive = false;
  private screenX = 0;
  private screenY = 0;

  private loop = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    ((callback: any) => {
      setTimeout(callback, 1000 / 60);
    });

  // check what cancelAnimation method to use
  private clearLoop = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame || clearTimeout;

  private transformProp = (window as any).transformProp ||
    (() => {
      const testEl = document.createElement('div');
      if (testEl.style.transform == null) {
        const vendors = ['Webkit', 'Moz', 'ms'];
        for (const vendor in vendors) {
          if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
            return vendors[vendor] + 'Transform';
          }
        }
      }
      return 'transform';
    })();

  constructor(private el: ElementRef, private renderer: Renderer2, public ngZone: NgZone) { }

  ngOnInit() {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          this.supportsPassive = true;
        }
      });
      // window.addEventListener('testPassive', null, opts);
      // window.removeEventListener('testPassive', null, opts);
    } catch (e) { }

    this.options = {
      speed: this.speed,
      center: this.center,
      wrapper: window.document.querySelector(this.wrapper),
      relativeToWrapper: this.relativeToWrapper,
      round: true,
      vertical: true,
      horizontal: false,
      callback() { },
    };

    this.clamp(this.options.speed, -10, 10);
  }

  ngAfterViewInit() {
    if (this.el && this.el.nativeElement) {
      this.subscription = fromEvent(this.el.nativeElement.querySelector('img'), 'load').subscribe(() =>
        this.ngZone.runOutsideAngular(this.init.bind(this))
      );
    }
  }

  clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }

  init() {
    this.screenY = window.innerHeight;
    this.screenX = window.innerWidth;

    this.setPosition();
    // Get and cache initial position of all elements
    this.block = this.createBlock(this.el.nativeElement);


    this.animate();

    // If paused, unpause and set listener for window resizing events
    if (this.pause) {
      window.addEventListener('resize', this.init.bind(this));
      this.pause = false;
      // Start the loop
      this.update();
    }
  }

  createBlock(el: HTMLElement) {
    const dataPercentage = this.options.percentage;
    const dataSpeed = this.options.speed;
    const dataZindex = this.options.zindex || 0;
    const dataMin = this.options.min;
    const dataMax = this.options.max;

    // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
    // ensures elements are positioned based on HTML layout.
    //
    // If the element has the percentage attribute, the posY and posX needs to be
    // the current scroll position's value, so that the elements are still positioned based on HTML layout
    let wrapperPosY = this.options.wrapper ? this.options.wrapper.scrollTop : (
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    );
    // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.
    if (this.options.relativeToWrapper) {
      const scrollPosY = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
      wrapperPosY = scrollPosY - this.options.wrapper.offsetTop;
    }
    const posY = this.options.vertical ? (dataPercentage || this.options.center ? wrapperPosY : 0) : 0;
    const posX = this.options.horizontal ? (dataPercentage || this.options.center ? this.options.wrapper ?
      this.options.wrapper.scrollLeft : (
        window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) : 0) : 0;

    const blockTop = posY + el.getBoundingClientRect().top;
    const blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    const blockLeft = posX + el.getBoundingClientRect().left;
    const blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    // apparently parallax equation everyone uses
    let percentageY = dataPercentage ? dataPercentage : (posY - blockTop + this.screenY) / (blockHeight + this.screenY);
    let percentageX = dataPercentage ? dataPercentage : (posX - blockLeft + this.screenX) / (blockWidth + this.screenX);
    if (this.options.center) { percentageX = 0.5; percentageY = 0.5; }

    // Optional individual block speed as data attr, otherwise global speed
    const speed = dataSpeed ? dataSpeed : this.options.speed;

    const bases = this.updatePosition(percentageX, percentageY, speed);

    // ~~Store non-translate3d transforms~~
    // Store inline styles and extract transforms
    const style = el.style.cssText;
    let transform = '';

    // Check if there's an inline styled transform
    const searchResult = /transform\s*:/i.exec(style);
    if (searchResult) {
      // Get the index of the transform
      const index = searchResult.index;

      // Trim the style to the transform point and get the following semi-colon index
      const trimmedStyle = style.slice(index);
      const delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      if (delimiter) {
        transform = ' ' + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
      } else {
        transform = ' ' + trimmedStyle.slice(11).replace(/\s/g, '');
      }
    }

    return {
      baseX: bases.x,
      baseY: bases.y,
      top: blockTop,
      left: blockLeft,
      height: blockHeight,
      width: blockWidth,
      speed,
      style,
      transform,
      zindex: dataZindex,
      min: dataMin,
      max: dataMax
    };
  }

  setPosition() {
    const oldY = this.posY;
    const oldX = this.posX;

    this.posY = this.options.wrapper ? this.options.wrapper.scrollTop :
      (document.documentElement || document.body.parentNode || document.body as any).scrollTop || window.pageYOffset;
    this.posX = this.options.wrapper ? this.options.wrapper.scrollLeft :
      (document.documentElement || document.body.parentNode || document.body as any).scrollLeft || window.pageXOffset;
    // If option relativeToWrapper is true, use relative wrapper value instead.
    if (this.options.relativeToWrapper) {
      const scrollPosY = (document.documentElement || document.body.parentNode || document.body as any).scrollTop || window.pageYOffset;
      this.posY = scrollPosY - this.options.wrapper.offsetTop;
    }
    if (oldY !== this.posY && this.options.vertical) {
      // scroll changed, return true
      return true;
    }

    if (oldX !== this.posX && this.options.horizontal) {
      // scroll changed, return true
      return true;
    }

    // scroll did not change
    return false;
  }

  updatePosition(percentageX: number, percentageY: number, speed: number) {
    const valueX = (speed * (100 * (1 - percentageX)));
    const valueY = (speed * (100 * (1 - percentageY)));

    const result = {
      x: this.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100,
      y: this.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100
    };

    return result;
  }

  // Remove event listeners and loop again
  deferredUpdate() {
    window.removeEventListener('resize', this.deferredUpdate.bind(this));
    window.removeEventListener('orientationchange', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : window).removeEventListener('scroll', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : document).removeEventListener('touchmove', this.deferredUpdate.bind(this));

    // loop again
    this.loopId = this.loop(this.update.bind(this));
  }

  update() {
    if (this.setPosition() && this.pause === false) {
      this.animate();

      // loop again

    }
    this.loopId = this.loop(this.update.bind(this));
    /*else {
      this.loopId = null;

      // Don't animate until we get a position updating event
      window.addEventListener('resize', this.deferredUpdate.bind(this));
      window.addEventListener('orientationchange', this.deferredUpdate.bind(this));
      (this.options.wrapper ? this.options.wrapper : window).addEventListener('scroll',
        this.deferredUpdate.bind(this), this.supportsPassive ? { passive: true } : false);
      (this.options.wrapper ? this.options.wrapper : document).addEventListener('touchmove',
        this.deferredUpdate.bind(this), this.supportsPassive ? { passive: true } : false);
    }*/
  }

  animate() {
    const percentageY = ((this.posY - this.block.top + this.screenY) / (this.block.height + this.screenY));
    const percentageX = ((this.posX - this.block.left + this.screenX) / (this.block.width + this.screenX));

    // Subtracting initialize value, so element stays in same spot as HTML
    const positions =
      this.updatePosition(percentageX, percentageY, this.block.speed); // - this.block.base;
    let positionY = positions.y - this.block.baseY;
    let positionX = positions.x - this.block.baseX;

    // The next two "if" blocks go like this:
    // Check if a limit is defined (first "min", then "max");
    // Check if we need to change the Y or the X
    // (Currently working only if just one of the axes is enabled)
    // Then, check if the new position is inside the allowed limit
    // If so, use new position. If not, set position to limit.

    // Check if a min limit is defined
    if (this.block.min !== null) {
      if (this.options.vertical && !this.options.horizontal) {
        positionY = positionY <= this.block.min ? this.block.min : positionY;
      }
      if (this.options.horizontal && !this.options.vertical) {
        positionX = positionX <= this.block.min ? this.block.min : positionX;
      }
    }

    // Check if a max limit is defined
    if (this.block.max !== null) {
      if (this.options.vertical && !this.options.horizontal) {
        positionY = positionY >= this.block.max ? this.block.max : positionY;
      }
      if (this.options.horizontal && !this.options.vertical) {
        positionX = positionX >= this.block.max ? this.block.max : positionX;
      }
    }

    const zindex = this.block.zindex;

    // Move that element
    // (Set the new translation and append initial inline transforms.)
    const translate = 'translate3d(' +
      (this.options.horizontal ? positionX : '0') + 'px,' +
      (this.options.vertical ? positionY : '0') + 'px,' +
      zindex + 'px) ' +
      this.block.transform;
    this.el.nativeElement.style[this.transformProp] = translate;

    this.options.callback(positions);
  }

  destroy() {
    if (this.el && this.el.nativeElement && this.block) {
      this.el.nativeElement.style.cssText = this.block.style;
    }
    if (!this.pause) {
      window.removeEventListener('resize', this.init);
      this.pause = true;
    }

    // Clear the animation loop to prevent possible memory leak
    this.clearLoop(this.loopId);
    this.loopId = null;
  }

  ngOnDestroy() {
    this.destroy();
    this.subscription.unsubscribe();
  }
}
