import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';

import { NotificationListModal } from '../modals/notification-list/notification-list.modal';

import { NotificationOverlayRef } from './notification-overlay-ref';

@Injectable()
export class NotificationOverlayService {
  constructor(private readonly overlay: Overlay, private readonly injector: Injector) {}

  public open(origin: ElementRef): NotificationOverlayRef {
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(origin);

    // Instantiate remote control
    const dialogRef = new NotificationOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);

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

  private getOverlayConfig(origin: ElementRef): OverlayConfig {
    const positionStrategy = this.overlay
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
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: '599px',
    });
  }

  private createOverlay(origin: ElementRef): OverlayRef {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(origin);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    dialogRef: NotificationOverlayRef,
  ): NotificationListModal {
    const injector = this.createInjector(dialogRef);

    const containerPortal = new ComponentPortal(NotificationListModal, undefined, injector);
    const containerRef = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(dialogRef: NotificationOverlayRef): Injector {
    return Injector.create({
      providers: [
        {
          provide: NotificationOverlayRef,
          useValue: dialogRef,
        },
      ],
      parent: this.injector,
    });
  }
}
