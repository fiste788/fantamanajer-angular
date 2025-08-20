/* eslint-disable max-lines */
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

// Options and Block interfaces kept in this file
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
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef); // Renamed for clarity

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
  #currentPosY = 0; // Renamed for clarity
  #currentPosX = 0; // Renamed for clarity
  #isPaused = true; // Renamed for clarity
  #subscription?: Subscription;
  #animationFrameId = 0; // Renamed for clarity
  #screenWidth = 0; // Renamed for clarity
  #screenHeight = 0; // Renamed for clarity
  #deferredUpdateHandler?: () => void; // Renamed for clarity
  #resizeHandler?: () => void; // Renamed for clarity

  #requestAnimationFrame?: (callback: FrameRequestCallback) => number; // Renamed for clarity
  #cancelAnimationFrame?: (handle: number) => void; // Renamed for clarity

  constructor() {
    afterNextRender(() => {
      this.#requestAnimationFrame = this.#window.requestAnimationFrame.bind(this.#window);
      this.#cancelAnimationFrame = this.#window.cancelAnimationFrame.bind(this.#window);

      const target = this.#elementRef.nativeElement.querySelector('img');
      if (target !== null) {
        this.#subscription = fromEvent(target, 'load')
          .pipe(tap(() => this.initParallax())) // Renamed init
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

      this.constrainSpeed(this.#options.speed, -10, 10); // Renamed clamp
    }
  }

  public constrainSpeed(num: number, min: number, max: number): number {
    // Renamed clamp
    if (num <= min) {
      return min;
    }

    return Math.min(num, max);
  }

  public initParallax(): void {
    // Renamed init
    if (this.#block !== undefined) {
      this.#elementRef.nativeElement.style.cssText = this.#block.style;
    }
    this.#screenHeight = this.#window.innerHeight; // Renamed screenY
    this.#screenWidth = this.#window.innerWidth; // Renamed screenX

    this.updateScrollPosition(); // Renamed setPosition
    // Get and cache initial position of all elements
    this.#block = this.createParallaxBlock(this.#elementRef.nativeElement); // Renamed createBlock

    this.applyParallaxAnimation(); // Renamed animate

    // If paused, unpause and set listener for window resizing events
    if (this.#isPaused) {
      // Renamed #pause
      this.#resizeHandler = this.initParallax.bind(this); // Renamed #handler
      this.#window.addEventListener('resize', this.#resizeHandler); // Updated handler name
      this.#isPaused = false; // Renamed #pause
      // Start the loop
      this.scheduleDeferredUpdate(); // Renamed update
    }
  }

  public createParallaxBlock(el: HTMLElement): Block {
    // Renamed createBlock
    const dataPercentage = this.#options.percentage;

    const pos = this.getScrollPosition(dataPercentage); // Renamed getPos

    const blockTop = pos.y + el.getBoundingClientRect().top;
    const blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    const blockLeft = pos.x + el.getBoundingClientRect().left;
    const blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    let percentageY = 0.5;
    let percentageX = 0.5;
    if (!this.#options.center) {
      // apparently parallax equation everyone uses
      percentageY =
        dataPercentage ||
        (pos.y - blockTop + this.#screenHeight) / (blockHeight + this.#screenHeight); // Updated screen height
      percentageX =
        dataPercentage ||
        (pos.x - blockLeft + this.#screenWidth) / (blockWidth + this.#screenWidth); // Updated screen width
    }

    const bases = this.calculateUpdatedPosition(percentageX, percentageY, this.#options.speed); // Renamed updatePosition

    // ~~Store non-translate3d transforms~~\n
    // Store inline styles and extract transforms
    const style = el.style.cssText;
    const transform = this.extractTransform(style); // Renamed calcTransform

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

  public getScrollPosition(dataPercentage: number): {
    // Renamed getPos
    x: number;
    y: number;
  } {
    // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)\n
    // ensures elements are positioned based on HTML layout.\n
    //\n
    // If the element has the percentage attribute, the posY and posX needs to be\n
    // the current scroll position\'s value, so that the elements are still positioned based on HTML layout\n
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
    // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.\n
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

  public extractTransform(style: string): string {
    // Renamed calcTransform
    let transform = '';

    // Check if there\'s an inline styled transform
    const searchResult = /transform\\s*:/i.exec(style);
    if (searchResult !== null) {
      // Get the index of the transform
      const { index } = searchResult;

      // Trim the style to the transform point and get the following semi-colon index
      const trimmedStyle = style.slice(index);
      const delimiter = trimmedStyle.indexOf(';');

      // Remove \"transform\" string and save the attribute
      transform = trimmedStyle.slice(11, delimiter === -1 ? undefined : delimiter);
      transform = ` ${transform}`.replaceAll(String.raw`\s`, '');
    }

    return transform;
  }

  public updateScrollPosition(): boolean {
    // Renamed setPosition
    const oldY = this.#currentPosY; // Updated variable name
    const oldX = this.#currentPosX; // Updated variable name
    const df = this.#document.documentElement;

    this.#currentPosY = this.#options.wrapper?.scrollTop ?? df.scrollTop; // Updated variable name
    this.#currentPosX = this.#options.wrapper?.scrollLeft ?? df.scrollLeft; // Updated variable name
    // If option relativeToWrapper is true, use relative wrapper value instead.\n
    if (this.#options.relativeToWrapper) {
      this.#currentPosY =
        (df.scrollTop || this.#window.scrollY) - (this.#options.wrapper?.offsetTop ?? 0); // Updated variable name
    }
    if (oldY !== this.#currentPosY && this.#options.vertical) {
      // Updated variable name
      return true;
    }

    if (oldX !== this.#currentPosX && this.#options.horizontal) {
      // Updated variable name
      return true;
    }

    // scroll did not change
    return false;
  }

  public calculateUpdatedPosition(
    // Renamed updatePosition
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
  public scheduleDeferredUpdate(): void {
    // Renamed deferredUpdate
    if (this.#deferredUpdateHandler) {
      // Updated handler name
      this.#window.removeEventListener('resize', this.#deferredUpdateHandler); // Updated handler name
      this.#window.removeEventListener('orientationchange', this.#deferredUpdateHandler); // Updated handler name
      (this.#options.wrapper ?? this.#window).removeEventListener(
        'scroll',
        this.#deferredUpdateHandler,
      ); // Updated handler name
      (this.#options.wrapper ?? this.#document).removeEventListener(
        'touchmove',
        this.#deferredUpdateHandler,
      ); // Updated handler name
    }
    // loop again
    if (this.#requestAnimationFrame) {
      // Updated method name
      this.#animationFrameId = this.#requestAnimationFrame(() => this.performUpdate()); // Updated method and variable name
    }
  }

  public performUpdate(): void {
    // Renamed update
    if (this.updateScrollPosition() && !this.#isPaused && this.#requestAnimationFrame) {
      // Updated variable and method name
      this.applyParallaxAnimation(); // Renamed animate

      // loop again
      this.#animationFrameId = this.#requestAnimationFrame(() => this.performUpdate()); // Updated method and variable name
    } else {
      this.#animationFrameId = 0; // Updated variable name

      this.#deferredUpdateHandler = this.scheduleDeferredUpdate.bind(this); // Updated handler name
      // Don\'t animate until we get a position updating event
      window.addEventListener('resize', this.#deferredUpdateHandler); // Updated handler name
      globalThis.addEventListener('orientationchange', this.#deferredUpdateHandler); // Updated handler name
      (this.#options.wrapper ?? globalThis).addEventListener(
        'scroll',
        this.#deferredUpdateHandler,
        {
          // Updated handler name
          passive: true,
        },
      );
      (this.#options.wrapper ?? document).addEventListener(
        'touchmove',
        this.#deferredUpdateHandler,
        {
          // Updated handler name
          passive: true,
        },
      );
    }
  }

  public applyParallaxAnimation(): void {
    // Renamed animate
    if (this.#block) {
      const percentageY =
        (this.#currentPosY - this.#block.top + this.#screenHeight) /
        (this.#block.height + this.#screenHeight); // Updated variable name
      const percentageX =
        (this.#currentPosX - this.#block.left + this.#screenWidth) /
        (this.#block.width + this.#screenWidth); // Updated variable name

      // Subtracting initialize value, so element stays in same spot as HTML
      const positions = this.calculateUpdatedPosition(percentageX, percentageY, this.#block.speed); // Updated method name
      let positionY = positions.y - this.#block.baseY;
      let positionX = positions.x - this.#block.baseX;
      // The next two \"if\" blocks go like this:\n
      // Check if a limit is defined (first \"min\", then \"max\");\n
      // Check if we need to change the Y or the X\n
      // (Currently working only if just one of the axes is enabled)\n
      // Then, check if the new position is inside the allowed limit\n
      // If so, use new position. If not, set position to limit.\n

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

      // Move that element\n
      // (Set the new translation and append initial inline transforms.)\n
      const x = this.#options.horizontal ? positionX : 0;
      const y = this.#options.vertical ? positionY : 0;
      const translate = `translate3d(${x}px,${y}px,${this.#options.zindex ?? 0}px) ${this.#block.transform}`;
      this.#renderer.setStyle(this.#elementRef.nativeElement, 'transform', translate); // Updated element ref

      if (this.#options.callback) {
        this.#options.callback(positions);
      }
    }
  }

  public destroyParallax(): void {
    // Renamed destroy
    if (!this.#isPaused && this.#resizeHandler) {
      // Updated variable name
      this.#window.removeEventListener('resize', this.#resizeHandler); // Updated handler name
      this.#isPaused = true; // Updated variable name
    }

    // Clear the animation loop to prevent possible memory leak
    if (this.#cancelAnimationFrame) {
      // Updated method name
      this.#cancelAnimationFrame(this.#animationFrameId); // Updated variable name
    }
    this.#animationFrameId = 0; // Updated variable name
  }

  public ngOnDestroy(): void {
    this.destroyParallax(); // Updated method name
    this.#subscription?.unsubscribe();
  }
}
