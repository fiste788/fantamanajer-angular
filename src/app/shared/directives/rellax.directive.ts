import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  booleanAttribute,
  input,
  numberAttribute,
  inject,
  DOCUMENT,
} from '@angular/core';
import { fromEvent, Subscription, tap } from 'rxjs';

import { WINDOW } from '@app/services';

interface Options {
  speed: number;
  center: boolean;
  wrapperSelector: string;
  wrapper?: HTMLElement;
  relativeToWrapper: boolean;
  round: boolean;
  vertical: boolean;
  horizontal: boolean;
  percentage: number;
  min?: number;
  max?: number;
  zindex?: number;
  callback?: (position: { x: number; y: number }) => void;
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
  selector: '[appRellax]',
  standalone: true,
  host: {
    '[style.will-change]': '"transform"',
  },
})
export class RellaxDirective implements OnInit, OnDestroy {
  readonly #document = inject<Document>(DOCUMENT);
  readonly #window = inject<Window>(WINDOW);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #renderer = inject(Renderer2);
  readonly #el = inject<ElementRef<HTMLElement>>(ElementRef);

  public speed = input(-3, { transform: numberAttribute });
  public center = input(false, { transform: booleanAttribute });
  public percentage = input(0, { transform: numberAttribute });
  public relativeToWrapper = input(false, { transform: booleanAttribute });
  public wrapper = input('window');

  readonly #options: Options = {
    round: true,
    vertical: true,
    horizontal: true,
    speed: this.speed(),
    center: this.center(),
    percentage: this.percentage(),
    relativeToWrapper: this.relativeToWrapper(),
    wrapperSelector: this.wrapper(),
  };

  #block?: Block;
  #posY = 0;
  #posX = 0;
  #pause = true;
  #subscription?: Subscription;
  #loopId = 0;
  #screenX = 0;
  #screenY = 0;
  #du?: () => void;
  #handler?: () => void;

  #loop?: (callback: FrameRequestCallback) => number;
  #clearLoop?: (handle: number) => void;

  constructor() {
    afterNextRender(() => {
      this.#loop = this.#window.requestAnimationFrame.bind(this.#window);
      this.#clearLoop = this.#window.cancelAnimationFrame.bind(this.#window);

      const target = this.#el.nativeElement.querySelector('img');
      if (target !== null) {
        this.#subscription = fromEvent(target, 'load')
          .pipe(tap(() => this.init()))
          .subscribe();
      }
    });
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.#platformId)) {
      const w = this.#document.querySelector<HTMLElement>(this.wrapper());
      if (w !== null) {
        this.#options.wrapper = w;
      }

      this.clamp(this.#options.speed, -10, 10);
    }
  }

  public clamp(num: number, min: number, max: number): number {
    if (num <= min) {
      return min;
    }

    return Math.min(num, max);
  }

  public init(): void {
    if (this.#block !== undefined) {
      this.#el.nativeElement.style.cssText = this.#block.style;
    }
    this.#screenY = this.#window.innerHeight;
    this.#screenX = this.#window.innerWidth;

    this.setPosition();
    // Get and cache initial position of all elements
    this.#block = this.createBlock(this.#el.nativeElement);

    this.animate();

    // If paused, unpause and set listener for window resizing events
    if (this.#pause) {
      this.#handler = this.init.bind(this);
      this.#window.addEventListener('resize', this.#handler);
      this.#pause = false;
      // Start the loop
      this.update();
    }
  }

  public createBlock(el: HTMLElement): Block {
    const dataPercentage = this.#options.percentage;

    const pos = this.getPos(dataPercentage);

    const blockTop = pos.y + el.getBoundingClientRect().top;
    const blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    const blockLeft = pos.x + el.getBoundingClientRect().left;
    const blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    let percentageY = 0.5;
    let percentageX = 0.5;
    if (!this.#options.center) {
      // apparently parallax equation everyone uses
      percentageY =
        dataPercentage || (pos.y - blockTop + this.#screenY) / (blockHeight + this.#screenY);
      percentageX =
        dataPercentage || (pos.x - blockLeft + this.#screenX) / (blockWidth + this.#screenX);
    }

    const bases = this.updatePosition(percentageX, percentageY, this.#options.speed);

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
      speed: this.#options.speed,
      style,
      transform,
    };
  }

  public getPos(dataPercentage: number): {
    x: number;
    y: number;
  } {
    // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
    // ensures elements are positioned based on HTML layout.
    //
    // If the element has the percentage attribute, the posY and posX needs to be
    // the current scroll position's value, so that the elements are still positioned based on HTML layout
    let wrapperPosY =
      this.#options.wrapper?.scrollTop ??
      (this.#window.scrollY ||
        this.#document.documentElement.scrollTop ||
        this.#document.body.scrollTop);
    const wrapperPosX =
      this.#options.wrapper?.scrollLeft ??
      (this.#window.scrollX ||
        this.#document.documentElement.scrollLeft ||
        this.#document.body.scrollLeft);
    // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.
    if (this.#options.relativeToWrapper) {
      const scrollPosY =
        this.#window.scrollY ||
        this.#document.documentElement.scrollTop ||
        this.#document.body.scrollTop;
      wrapperPosY = scrollPosY - (this.#options.wrapper?.offsetTop ?? 0);
    }
    const x = dataPercentage || this.#options.center ? wrapperPosY : 0;
    const y = dataPercentage || this.#options.center ? wrapperPosX : 0;

    return {
      x: this.#options.vertical ? x : 0,
      y: this.#options.horizontal ? y : 0,
    };
  }

  public calcTransform(style: string): string {
    let transform = '';

    // Check if there's an inline styled transform
    const searchResult = /transform\s*:/i.exec(style);
    if (searchResult !== null) {
      // Get the index of the transform
      const { index } = searchResult;

      // Trim the style to the transform point and get the following semi-colon index
      const trimmedStyle = style.slice(index);
      const delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      transform = trimmedStyle.slice(11, delimiter === -1 ? undefined : delimiter);
      transform = ` ${transform}`.replaceAll(/\s/g, '');
    }

    return transform;
  }

  public setPosition(): boolean {
    const oldY = this.#posY;
    const oldX = this.#posX;
    const df = this.#document.documentElement;

    this.#posY = this.#options.wrapper?.scrollTop ?? df.scrollTop;
    this.#posX = this.#options.wrapper?.scrollLeft ?? df.scrollLeft;
    // If option relativeToWrapper is true, use relative wrapper value instead.
    if (this.#options.relativeToWrapper) {
      this.#posY = (df.scrollTop || this.#window.scrollY) - (this.#options.wrapper?.offsetTop ?? 0);
    }
    if (oldY !== this.#posY && this.#options.vertical) {
      return true;
    }

    if (oldX !== this.#posX && this.#options.horizontal) {
      return true;
    }

    // scroll did not change
    return false;
  }

  public updatePosition(
    percentageX: number,
    percentageY: number,
    speed: number,
  ): {
    x: number;
    y: number;
  } {
    const valueX = speed * ((1 - percentageX) * 100);
    const valueY = speed * ((1 - percentageY) * 100);

    return {
      x: this.#options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100,
      y: this.#options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100,
    };
  }

  // Remove event listeners and loop again
  public deferredUpdate(): void {
    if (this.#du) {
      this.#window.removeEventListener('resize', this.#du);
      this.#window.removeEventListener('orientationchange', this.#du);
      (this.#options.wrapper ?? this.#window).removeEventListener('scroll', this.#du);
      (this.#options.wrapper ?? this.#document).removeEventListener('touchmove', this.#du);
    }
    // loop again
    if (this.#loop) {
      this.#loopId = this.#loop(() => this.update());
    }
  }

  public update(): void {
    if (this.setPosition() && !this.#pause && this.#loop) {
      this.animate();

      // loop again
      this.#loopId = this.#loop(() => this.update());
    } else {
      this.#loopId = 0;

      this.#du = this.deferredUpdate.bind(this);
      // Don't animate until we get a position updating event
      window.addEventListener('resize', this.#du);
      globalThis.addEventListener('orientationchange', this.#du);
      (this.#options.wrapper ?? globalThis).addEventListener('scroll', this.#du, {
        passive: true,
      });
      (this.#options.wrapper ?? document).addEventListener('touchmove', this.#du, {
        passive: true,
      });
    }
  }

  public animate(): void {
    if (this.#block) {
      const percentageY =
        (this.#posY - this.#block.top + this.#screenY) / (this.#block.height + this.#screenY);
      const percentageX =
        (this.#posX - this.#block.left + this.#screenX) / (this.#block.width + this.#screenX);

      // Subtracting initialize value, so element stays in same spot as HTML
      const positions = this.updatePosition(percentageX, percentageY, this.#block.speed); // - this.block.base;
      let positionY = positions.y - this.#block.baseY;
      let positionX = positions.x - this.#block.baseX;
      // The next two "if" blocks go like this:
      // Check if a limit is defined (first "min", then "max");
      // Check if we need to change the Y or the X
      // (Currently working only if just one of the axes is enabled)
      // Then, check if the new position is inside the allowed limit
      // If so, use new position. If not, set position to limit.

      // Check if a min limit is defined
      if (this.#options.min) {
        if (this.#options.vertical && !this.#options.horizontal) {
          positionY = Math.max(positionY, this.#options.min);
        }
        if (this.#options.horizontal && !this.#options.vertical) {
          positionX = Math.max(positionX, this.#options.min);
        }
      }

      // Check if a max limit is defined
      if (this.#options.max) {
        if (this.#options.vertical && !this.#options.horizontal) {
          positionY = Math.min(positionY, this.#options.max);
        }
        if (this.#options.horizontal && !this.#options.vertical) {
          positionX = Math.min(positionX, this.#options.max);
        }
      }

      // Move that element
      // (Set the new translation and append initial inline transforms.)
      const x = this.#options.horizontal ? positionX : 0;
      const y = this.#options.vertical ? positionY : 0;
      const translate = `translate3d(${x}px,${y}px,${this.#options.zindex ?? 0}px) ${this.#block.transform}`;
      this.#renderer.setStyle(this.#el.nativeElement, 'transform', translate);

      if (this.#options.callback) {
        this.#options.callback(positions);
      }
    }
  }

  public destroy(): void {
    if (!this.#pause && this.#handler) {
      this.#window.removeEventListener('resize', this.#handler);
      this.#pause = true;
    }

    // Clear the animation loop to prevent possible memory leak
    if (this.#clearLoop) {
      this.#clearLoop(this.#loopId);
    }
    this.#loopId = 0;
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.#subscription?.unsubscribe();
  }
}
