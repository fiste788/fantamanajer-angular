import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { WINDOW } from '@app/services';

class Options {
  public speed: number;
  public center: boolean;
  public wrapperSelector: string;
  public wrapper?: HTMLElement;
  public relativeToWrapper: boolean;
  public round?= true;
  public vertical?= true;
  public horizontal?= false;
  public percentage: number;
  public min?: number;
  public max?: number;
  public zindex?= 1;
  public callback?: (position: { x: number, y: number }) => void;
}

interface IBlock {
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
  selector: '[appRellax]',
})
export class RellaxDirective implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('style.will-change') public will = 'transform';
  // @HostBinding('style.transform') transform = 'translate3d(0,0,0)';
  @Input() public speed = -3;
  @Input() public center = false;
  @Input() public percentage = 0;
  @Input() public relativeToWrapper = false;
  @Input() public wrapper = '.mat-drawer-content';

  private readonly options: Options = new Options();
  private block: IBlock;
  private posY = 0;
  private posX = 0;
  private pause = true;
  private subscription: Subscription;
  private loopId = 0;
  // private supportsPassive = false;
  private screenX = 0;
  private screenY = 0;

  private readonly loop = this.window.requestAnimationFrame ??
    this.window.webkitRequestAnimationFrame ??
    ((callback: () => void) => {
      setTimeout(callback, 1000 / 60);
    });

  // check what cancelAnimation method to use
  private readonly clearLoop = this.window.cancelAnimationFrame ?? clearTimeout;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef<HTMLElement>,
    private readonly ngZone: NgZone,
  ) {
    this.options.speed = this.speed;
    this.options.center = this.center;
    this.options.percentage = this.percentage;
    this.options.relativeToWrapper = this.relativeToWrapper;
    this.options.wrapperSelector = this.wrapper;
  }

  public ngOnInit(): void {
    this.testPassive();

    const w = this.document.querySelector(this.wrapper);
    if (w !== null) {
      this.options.wrapper = w as HTMLElement;
    }

    this.clamp(this.options.speed, -10, 10);
  }

  public testPassive(): void {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: (): void => {
          // this.supportsPassive = true;
        },
      });
      // tslint:disable-next-line: no-any
      (this.window as any).addEventListener('testPassive', undefined, opts);
      // tslint:disable-next-line: no-any
      (this.window as any).removeEventListener('testPassive', undefined, opts);
    } catch (e) {
      return;
    }
  }

  public ngAfterViewInit(): void {
    if (this.el?.nativeElement !== undefined) {
      const target = this.el.nativeElement.querySelector('img');
      if (target !== null) {
        this.subscription = fromEvent(target, 'load')
          .subscribe(() => {
            this.ngZone.runOutsideAngular(() => {
              this.init();
            });
          });
      }
    }
  }

  public clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
  }

  public init(): void {
    if (this.block !== undefined) {
      this.el.nativeElement.style.cssText = this.block.style;
    }
    this.screenY = this.window.innerHeight;
    this.screenX = this.window.innerWidth;

    this.setPosition();
    // Get and cache initial position of all elements
    this.block = this.createBlock(this.el.nativeElement);

    this.animate();

    // If paused, unpause and set listener for window resizing events
    if (this.pause) {
      this.window.addEventListener('resize', this.init.bind(this));
      this.pause = false;
      // Start the loop
      this.update();
    }
  }

  public createBlock(el: HTMLElement): IBlock {
    const dataPercentage = this.options.percentage;

    const pos = this.getPos(dataPercentage);

    const blockTop = pos.y + el.getBoundingClientRect().top;
    const blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    const blockLeft = pos.x + el.getBoundingClientRect().left;
    const blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    let percentageY = 0.5;
    let percentageX = 0.5;
    if (!this.options.center) {
      // apparently parallax equation everyone uses
      percentageY = dataPercentage ? dataPercentage : (pos.y - blockTop + this.screenY) / (blockHeight + this.screenY);
      percentageX = dataPercentage ? dataPercentage : (pos.x - blockLeft + this.screenX) / (blockWidth + this.screenX);
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
      transform,
    };
  }

  public getPos(dataPercentage: number): { x: number, y: number } {
    // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
    // ensures elements are positioned based on HTML layout.
    //
    // If the element has the percentage attribute, the posY and posX needs to be
    // the current scroll position's value, so that the elements are still positioned based on HTML layout
    let wrapperPosY = this.options.wrapper ? this.options.wrapper.scrollTop : (
      this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop
    );
    const wrapperPosX = this.options.wrapper ? this.options.wrapper.scrollLeft : (
      this.window.pageXOffset || this.document.documentElement.scrollLeft || this.document.body.scrollLeft
    );
    // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.
    if (this.options.relativeToWrapper) {
      const scrollPosY = (this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop);
      wrapperPosY = scrollPosY - (this.options.wrapper?.offsetTop ?? 0);
    }

    return {
      x: this.options.vertical ? (dataPercentage || this.options.center ? wrapperPosY : 0) : 0,
      y: this.options.horizontal ? (dataPercentage || this.options.center ? wrapperPosX : 0) : 0,
    };
  }

  public calcTransform(style: string): string {
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

  public setPosition(): boolean {
    const oldY = this.posY;
    const oldX = this.posX;

    this.posY = this.options.wrapper ? this.options.wrapper.scrollTop :
      (this.document.documentElement ?? this.document.body.parentNode ?? this.document.body).scrollTop || this.window.pageYOffset;
    this.posX = this.options.wrapper ? this.options.wrapper.scrollLeft :
      (this.document.documentElement ?? this.document.body.parentNode ?? this.document.body).scrollLeft || this.window.pageXOffset;
    // If option relativeToWrapper is true, use relative wrapper value instead.
    if (this.options.relativeToWrapper) {
      const scrollPosY = (this.document.documentElement ?? this.document.body.parentNode ?? this.document.body).scrollTop
        || this.window.pageYOffset;
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

  public updatePosition(percentageX: number, percentageY: number, speed: number): { x: number, y: number } {
    const valueX = (speed * ((1 - percentageX) * 100));
    const valueY = (speed * ((1 - percentageY) * 100));

    const result = {
      x: this.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100,
      y: this.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100,
    };

    return result;
  }

  // Remove event listeners and loop again
  public deferredUpdate(): void {
    this.window.removeEventListener('resize', this.deferredUpdate.bind(this));
    this.window.removeEventListener('orientationchange', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : this.window).removeEventListener('scroll', this.deferredUpdate.bind(this));
    (this.options.wrapper ? this.options.wrapper : this.document).removeEventListener('touchmove', this.deferredUpdate.bind(this));

    // loop again
    this.loopId = this.loop(this.update.bind(this));
  }

  public update(): void {
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

  public animate(): void {
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
    const translate = `translate3d(${this.options.horizontal ? positionX : 0}px,${this.options.vertical ? positionY : 0}px,${this.options.zindex}px) ${this.block.transform}`;
    this.renderer.setStyle(this.el.nativeElement, 'transform', translate);

    if (this.options.callback) {
      this.options.callback(positions);
    }
  }

  public destroy(): void {
    if (!this.pause) {
      this.window.removeEventListener('resize', () => {
        this.init();
      });
      this.pause = true;
    }

    // Clear the animation loop to prevent possible memory leak
    this.clearLoop(this.loopId);
    this.loopId = 0;
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }
}
