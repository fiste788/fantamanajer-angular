import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector, inject } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';

import { NotificationListModal } from '../modals/notification-list/notification-list.modal';

import { NotificationOverlayRef } from './notification-overlay-ref';

@Injectable({
  providedIn: 'any',
})
export class NotificationOverlayService {
  readonly #overlay = inject(Overlay);
  readonly #injector = inject(Injector);

  public open(origin: ElementRef): NotificationOverlayRef {
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.#createOverlay(origin);

    // Instantiate remote control
    const dialogRef = new NotificationOverlayRef(overlayRef);

    const overlayComponent = this.#attachDialogContainer(overlayRef, dialogRef);

    dialogRef.componentInstance = overlayComponent;

    void firstValueFrom(
      overlayRef.backdropClick().pipe(
        tap(() => {
          dialogRef.close();
        }),
      ),
      { defaultValue: undefined },
    );

    return dialogRef;
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

  #createOverlay(origin: ElementRef): OverlayRef {
    // Returns an OverlayConfig
    const overlayConfig = this.#getOverlayConfig(origin);

    // Returns an OverlayRef
    return this.#overlay.create(overlayConfig);
  }

  #attachDialogContainer(
    overlayRef: OverlayRef,
    dialogRef: NotificationOverlayRef,
  ): NotificationListModal {
    const injector = this.#createInjector(dialogRef);

    const containerPortal = new ComponentPortal(NotificationListModal, undefined, injector);
    const containerRef = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  #createInjector(dialogRef: NotificationOverlayRef): Injector {
    return Injector.create({
      providers: [
        {
          provide: NotificationOverlayRef,
          useValue: dialogRef,
        },
      ],
      parent: this.#injector,
    });
  }
}
