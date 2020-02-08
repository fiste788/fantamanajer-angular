import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, Injector } from '@angular/core';
import { NotificationOverlayRef } from './notification-overlay-ref';
import { NotificationOverlayComponent } from './notification-overlay/notification-overlay.component';

@Injectable()
export class NotificationOverlayService {

  constructor(private readonly overlay: Overlay, private readonly injector: Injector) { }

  open(origin: ElementRef): NotificationOverlayRef {
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(origin);

    // Instantiate remote control
    const dialogRef = new NotificationOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);

    dialogRef.componentInstance = overlayComponent;

    overlayRef.backdropClick()
      .subscribe(() => {
        dialogRef.close();
      });

    return dialogRef;
  }

  private getOverlayConfig(origin: ElementRef): OverlayConfig {

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withFlexibleDimensions(true)
      .withPush(true)
      .withViewportMargin(16)
      .withGrowAfterOpen(true)
      .withPositions([{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      }
      ]);

    const overlayConfig = new OverlayConfig({
      width: '599px',
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  private createOverlay(origin: ElementRef): OverlayRef {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(origin);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: NotificationOverlayRef): NotificationOverlayComponent {
    const injector = this.createInjector(dialogRef);

    const containerPortal = new ComponentPortal(NotificationOverlayComponent, undefined, injector);
    const containerRef: ComponentRef<NotificationOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(dialogRef: NotificationOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(NotificationOverlayRef, dialogRef);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
