import { Injectable, ElementRef, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { NotificationOverlayComponent } from './notification-overlay/notification-overlay.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { NotificationOverlayRef } from './notification-overlay-ref';

@Injectable()
export class NotificationOverlayService {

  constructor(private overlay: Overlay, private injector: Injector) { }

  open(origin: ElementRef) {
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(origin);

    // Instantiate remote control
    const dialogRef = new NotificationOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);

    dialogRef.componentInstance = overlayComponent;

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    return dialogRef;
  }

  private getOverlayConfig(origin: ElementRef): OverlayConfig {
    /*const positionStrategy = this.overlay.position().connectedTo(origin, { originX: 'end', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'top' });*/

    const positionStrategy = this.overlay.position().flexibleConnectedTo(origin)
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

  private createOverlay(origin: ElementRef) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(origin);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: NotificationOverlayRef) {
    const injector = this.createInjector(dialogRef);

    const containerPortal = new ComponentPortal(NotificationOverlayComponent, null, injector);
    const containerRef: ComponentRef<NotificationOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(dialogRef: NotificationOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(NotificationOverlayRef, dialogRef);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
