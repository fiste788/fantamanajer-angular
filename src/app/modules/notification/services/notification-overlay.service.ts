import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, inject } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';

import { NotificationListModal } from '../modals/notification-list/notification-list.modal';

@Injectable({
  providedIn: 'any',
})
export class NotificationOverlayService {
  readonly #overlay = inject(Overlay);

  public open(origin: ElementRef): void {
    // Returns an OverlayRef (which is a PortalHost)
    const overlayConfig = this.#getOverlayConfig(origin);
    const overlayRef = this.#overlay.create(overlayConfig);
    const containerPortal = new ComponentPortal(NotificationListModal);
    overlayRef.attach(containerPortal);

    void firstValueFrom(
      overlayRef.backdropClick().pipe(
        tap(() => {
          overlayRef.detach();
        }),
      ),
      { defaultValue: undefined },
    );
  }

  #getOverlayConfig(origin: ElementRef): OverlayConfig {
    const positionStrategy = this.#overlay
      .position()
      .flexibleConnectedTo(origin)
      .withFlexibleDimensions(true)
      .withPush(true)
      .withViewportMargin(16)
      .withGrowAfterOpen(true)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    return new OverlayConfig({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.#overlay.scrollStrategies.block(),
      width: '599px',
    });
  }
}
