import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #iconRegistry = inject(MatIconRegistry);
  readonly #sanitizer = inject(DomSanitizer);

  public init(): void {
    this.#iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    if (isPlatformBrowser(this.#platformId)) {
      this.#iconRegistry.addSvgIconSet(
        this.#sanitizer.bypassSecurityTrustResourceUrl('/svg/fantamanajer-icons.svg'),
      );
    } else {
      this.#iconRegistry.addSvgIconLiteral(
        'soccer_field',
        this.#sanitizer.bypassSecurityTrustHtml('<svg></svg>'),
      );
    }
  }
}
