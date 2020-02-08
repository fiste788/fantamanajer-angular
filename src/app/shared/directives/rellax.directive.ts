import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

class Options {
  speed: number;
  center: boolean;
  wrapperSelector: string;
  wrapper?: HTMLElement;
  relativeToWrapper: boolean;
  round ?= true;
  vertical ?= true;
  horizontal ?= false;
  percentage: number;
  min?: number;
  max?: number;
  zindex ?= 1;
  callback?: Function;
}

interface Block {
  baseX: number;
  baseY: number;
  top: number;
  left: number;
  height: number;
  width: number;
  speed: number;
  style: string;
  transform: string;
}

@Directive({
  selector: '[fmRellax]'
})
export class RellaxDirective implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('style.will-change') will = 'transform';
  @HostBinding('style.transform') transform = 'translate3d(0,0,0)';
  @Input() speed = -2;
  @Input() center = false;
  @Input() percentage = 0;
  @Input() relativeToWrapper = false;
  @Input() wrapper = '.mat-drawer-content';

  private readonly options: Options = {
    speed: this.speed,
    center: this.center,
    percentage: this.percentage,
    relativeToWrapper: this.relativeToWrapper,
    wrapperSelector: this.wrapper
  };
  private block: Block;
  private posY = 0;
  private posX = 0;
  private pause = true;
  private subscription: Subscription;
  private loopId = 0;
  private supportsPassive = false;
  private screenX = 0;
  private screenY = 0;

  private readonly loop = window.requestAnimationFrame ??
    window.webkitRequestAnimationFrame ??
    (window as any).mozRequestAnimationFrame ??
    (window as any).msRequestAnimationFrame ??
    ((callback: Function) => {
      setTimeout(callback, 1000 / 60);
    });

  // check what cancelAnimation method to use
  private readonly clearLoop = window.cancelAnimationFrame ?? (window as any).mozCancelAnimationFrame ?? clearTimeout;

  private readonly transformProp = (window as any).transformProp || (() => {
    const testEl = document.createElement('div');
    if (!testEl.style.transform) {
      const vendors = ['Webkit', 'Moz', 'ms'];
      for (const vendor of vendors) {
        if (testEl.style[`${vendors[vendor]}Transform`] !== undefined) {
          return `${vendors[vendor]}Transform`;
        }
      }
    }

    return 'transform';
  })();

  constructor(private readonly el: ElementRef, private readonly ngZone: NgZone) { }

  ngOnInit(): void {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: (): void => {
          this.supportsPassive = true;
        }
      });
      (window as any).addEventListener('testPassive', undefined, opts);
      (window as any).removeEventListener('testPassive', undefined, opts);
      // tslint:disable-next-line: no-empty
    } catch (e) { }

    const w = window.document.querySelector(this.wrapper);
    if (w !== null) {
      this.options.wrapper = w as HTMLElement;
    }

    this.clamp(this.options.speed, -10, 10);
  }

  ngAfterViewInit(): void {
    if (this.el?.nativeElement) {
      this.subscription = fromEvent(this.el.nativeElement.querySelector('img'), 'load')
        .subscribe(() => {
          this.ngZone.runOutsideAngular(() => {
            this.init();
          });
        });
    }
  }

  clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
  }

  init(): void {
    if (this.block !== undefined) {
      this.el.nativeElement.style.cssText = this.block.style;
    }
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

  // tslint:disable-next-line: cyclomatic-complexity
  createBlock(el: HTMLElement): Block {
    const dataPercentage = this.options.percentage;

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
      wrapperPosY = scrollPosY - (this.options.wrapper?.offsetTop ?? 0);
    }
    const posY: number = this.options.vertical ? (dataPercentage || this.options.center ? wrapperPosY : 0) : 0;
    const posX: number = this.options.horizontal ? (dataPercentage || this.options.center ? this.options.wrapper ?
      this.options.wrapper.scrollLeft : (
        window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) : 0) : 0;

    const blockTop = posY + el.getBoundingClientRect().top;
    const blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    const blockLeft = posX + el.getBoundingClientRect().left;
    const blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    let percentageY = 0.5;
    let percentageX = 0.5;
    if (!this.options.center) {
      // apparently parallax equation everyone uses
      percentageY = dataPercentage ? dataPercentage : (posY - blockTop + this.screenY) / (blockHeight + this.screenY);
      percentageX = dataPercentage ? dataPercentage : (posX - blockLeft + this.screenX) / (blockWidth + this.screenX);
    }

    const bases = this.updatePosition(percentageX, percentageY, this.options.speed);

    // ~~Store non-translate3d transforms~~
    // Store inline styles and extract transforms
    const style = el.style.cssText;
    const transform = this.calcTransform(style);

    return {
      baseX: bases.x,
      baseY: bases.y,
      top: blockTop,
      left: blockLeft,
      height: blockHeight,
      width: blockWidth,
      speed: this.options.speed,
      style,
      transform
    };
  }

  calcTransform(style: string): string {
    let transform = '';

    // Check if there's an inline styled transform
    const searchResult = /transform\s*:/i.exec(style);
    if (searchResult !== null) {
      // Get the index of the transform
      const index = searchResult.index;

      // Trim the style to the transform point and get the following semi-colon index
      const trimmedStyle = style.slice(index);
      const delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      transform = trimmedStyle.slice(11, delimiter >= 0 ? delimiter : undefined);
      transform = ` ${transform}`.replace(/\s/g, '');
    }

    return transform;
  }

  setPosition(): boolean {
    const oldY = this.posY;
    const oldX = this.posX;

    this.posY = this.options.wrapper ? this.options.wrapper.scrollTop :
      (document.documentElement ?? document.body.parentNode ?? document.body as any).scrollTop || window.pageYOffset;
    this.posX = this.options.wrapper ? this.options.wrapper.scrollLeft :
      (document.documentElement ?? document.body.parentNode ?? document.body as any).scrollLeft || window.pageXOffset;
    // If option relativeToWrapper is true, use relative wrapper value instead.
    if (this.options.relativeToWrapper) {
      const scrollPosY = (document.documentElement ?? document.body.parentNode ?? document.body as any).scrollTop || window.pageYOffset;
      this.posY = scrollPosY - (this.options.wrapper?.offsetTop ?? 0);
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

  updatePosition(percentageX: number, percentageY: number, speed: number): { x: number, y: number } {
    const valueX = (speed * ((1 - percentageX) * 100));
    const valueY = (speed * ((1 - percentageY) * 100));

    const result = {
      x: this.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100,
      y: this.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100
    };

    return result;
  }

  // Remove event listeners and loop again
  deferredUpdate(): void {
    window.removeEventListener('resize', this.deferredUpdate.bind(this));
    window.removeEventListener('orientationchange', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : window).removeEventListener('scroll', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : document).removeEventListener('touchmove', this.deferredUpdate.bind(this));

    // loop again
    this.loopId = this.loop(this.update.bind(this));
  }

  update(): void {
    if (this.setPosition() && !this.pause) {
      this.animate();

      // loop again

    }
    // else {
    //   this.loopId = 0;

    //   // Don't animate until we get a position updating event
    //   window.addEventListener('resize', this.deferredUpdate.bind(this));
    //   window.addEventListener('orientationchange', this.deferredUpdate.bind(this));
    //   (this.options.wrapper ? this.options.wrapper : window).addEventListener('scroll',
    //     this.deferredUpdate.bind(this), this.supportsPassive ? { passive: true } : false);
    //   (this.options.wrapper ? this.options.wrapper : document).addEventListener('touchmove',
    //     this.deferredUpdate.bind(this), this.supportsPassive ? { passive: true } : false);
    // }
    this.loopId = this.loop(this.update.bind(this));
  }

  animate(): void {
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
    if (this.options.min) {
      if (this.options.vertical && !this.options.horizontal) {
        positionY = positionY <= this.options.min ? this.options.min : positionY;
      }
      if (this.options.horizontal && !this.options.vertical) {
        positionX = positionX <= this.options.min ? this.options.min : positionX;
      }
    }

    // Check if a max limit is defined
    if (this.options.max) {
      if (this.options.vertical && !this.options.horizontal) {
        positionY = positionY >= this.options.max ? this.options.max : positionY;
      }
      if (this.options.horizontal && !this.options.vertical) {
        positionX = positionX >= this.options.max ? this.options.max : positionX;
      }
    }

    // Move that element
    // (Set the new translation and append initial inline transforms.)
    const translate = `translate3d(${this.options.horizontal ? positionX : 0}px,${this.options.vertical ? positionY : 0}px,${this.options.zindex}px),${this.block.transform}`;
    this.el.nativeElement.style[this.transformProp] = translate;

    if (this.options.callback) {
      this.options.callback(positions);
    }
  }

  destroy(): void {
    if (!this.pause) {
      window.removeEventListener('resize', () => {
        this.init();
      });
      this.pause = true;
    }

    // Clear the animation loop to prevent possible memory leak
    this.clearLoop(this.loopId);
    this.loopId = 0;
  }

  ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }
}
