import type { OnChanges, OnInit } from '@angular/core';
import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSrcset]',
  standalone: true,
})
export class SrcsetDirective implements OnChanges, OnInit {

  readonly #renderer = inject(Renderer2);

  public readonly appSrcset = input<Record<string, string> | string | null>();
  public readonly placeholder = input<string>();

  // Renamed private member for clarity
  readonly #elementRef = inject<ElementRef<HTMLImageElement>>(ElementRef);

  public ngOnInit(): void {
    this.applySrcset(); // Renamed init
  }

  public ngOnChanges(): void {
    this.applySrcset(); // Renamed init
  }

  public applySrcset(): void {
    // Renamed init
    const srcset = this.appSrcset();
    if (srcset !== null && srcset !== undefined) {
      if (typeof srcset === 'string') {
        // Updated private member name
        this.#renderer.setProperty(this.#elementRef.nativeElement, 'srcset', this.appSrcset);
      } else {
        this.#processSrcsetRecord(srcset); // Renamed processRecord
      }
    } else {
      // Updated private member name
      this.#renderer.setProperty(this.#elementRef.nativeElement, 'src', this.placeholder);
    }
  }

  #processSrcsetRecord(set: Record<string, string>): void {
    // Renamed processRecord and made private
    const entries = Object.entries(set);
    const srcset = entries.map(([k, v]) => `${v} ${k}`);
    const lastEntry = entries.pop();
    if (lastEntry) {
      const [key, source] = lastEntry;
      // Extract width from the key (e.g., "256w" -> 256)
      const width = +key.slice(0, Math.max(0, key.indexOf('w')));
      if (this.#elementRef.nativeElement.sizes === '') {
        // Updated private member name
        // Set default sizes if not already set
        this.#renderer.setStyle(
          this.#elementRef.nativeElement, // Updated private member name
          'sizes',
          `(max-width:${width}px) 100vw, ${width}px`,
        );
      }
      // Set the src attribute to the largest image source
      this.#renderer.setAttribute(this.#elementRef.nativeElement, 'src', source); // Updated private member name
      // Set the srcset attribute
      this.#renderer.setAttribute(this.#elementRef.nativeElement, 'srcset', srcset.join(',')); // Updated private member name
    }
  }

}
