import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {}

  public init() {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    if (isPlatformBrowser(this.platformId)) {
      this.iconRegistry.addSvgIconSet(
        this.sanitizer.bypassSecurityTrustResourceUrl('/public/svg/fantamanajer-icons.svg'),
      );
    } else {
      this.iconRegistry.addSvgIconLiteral(
        'soccer_field',
        this.sanitizer.bypassSecurityTrustHtml('<svg></svg>'),
      );
    }
  }
}
