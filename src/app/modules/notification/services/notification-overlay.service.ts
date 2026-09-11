import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import type { ElementRef } from '@angular/core';
import { inject, Service } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { NotificationListModal } from '../components/modals/notification-list/notification-list.modal';

@Service()
export class NotificationOverlayService {

  readonly #overlay = inject(Overlay);

  public async open(origin: ElementRef): Promise<void> {
    // Reasync open(origin: ElementRef): Promise<void>a PortalHost)
    const overlayConfig = this.#getOverlayConfig(origin);
    const overlayReference = this.#overlay.create(overlayConfig);
    const containerPortal = new ComponentPortal(NotificationListModal);
    overlayReference.attach(containerPortal);

    const close = await firstValueFrom(overlayReference.backdropClick(), { defaultValue: undefined });
    if (close) {
      overlayReference.detach();
    }
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
      scrollStrategy: this.#overlay.scrollStrategies.noop(),
      width: '599px',
    });
  }

}
