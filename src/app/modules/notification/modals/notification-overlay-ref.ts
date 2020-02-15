import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NotificationOverlayComponent } from './notification-overlay/notification-overlay.component';

export class NotificationOverlayRef {
  componentInstance?: NotificationOverlayComponent;

  private readonly beforeCloseVar = new Subject<undefined>();
  private readonly afterClosedVar = new Subject<undefined>();

  constructor(private readonly overlayRef: OverlayRef) { }

  close(): void {
    // Listen for animation 'start' events
    this.componentInstance?.animationStateChanged.pipe(
      filter(event => event.phaseName === 'start'),
      take(1)
    )
      .subscribe(() => {
        this.beforeCloseVar.next();
        this.beforeCloseVar.complete();
        this.overlayRef.detachBackdrop();
      });

    // Listen for animation 'done' events
    this.componentInstance?.animationStateChanged.pipe(
      filter(event => event.phaseName === 'done' && event.toState === 'leave'),
      take(1)
    )
      .subscribe(() => {
        this.overlayRef.dispose();
        this.afterClosedVar.next();
        this.afterClosedVar.complete();

        // Make sure to also clear the reference to the
        // component instance to avoid memory leaks
        this.componentInstance = undefined;
      });

    // Start exit animation
    this.componentInstance?.startExitAnimation();
  }

  afterClosed(): Observable<void> {
    return this.afterClosedVar.asObservable();
  }

  beforeClose(): Observable<void> {
    return this.beforeCloseVar.asObservable();
  }

}
