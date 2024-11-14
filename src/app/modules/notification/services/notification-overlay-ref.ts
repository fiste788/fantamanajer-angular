import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

import { NotificationListModal } from '../modals/notification-list/notification-list.modal';

export class NotificationOverlayRef {
  readonly #beforeCloseVar = new Subject<void>();
  readonly #afterClosedVar = new Subject<void>();

  public componentInstance?: NotificationListModal;

  constructor(private readonly overlayRef: OverlayRef) {}

  public close(): void {
    // Listen for animation 'start' events
    this.componentInstance?.animationStateChanged.subscribe((event) => {
      if (event.phaseName === 'start') {
        this.#beforeCloseVar.next();
        this.#beforeCloseVar.complete();
        this.overlayRef.detachBackdrop();
      }
    });

    // Listen for animation 'done' events
    this.componentInstance?.animationStateChanged.subscribe((event) => {
      if (event.phaseName === 'done' && event.toState === 'leave') {
        this.overlayRef.dispose();
        this.#afterClosedVar.next();
        this.#afterClosedVar.complete();
      }

      // Make sure to also clear the reference to the
      // component instance to avoid memory leaks
      this.componentInstance = undefined;
    });

    // Start exit animation
    this.componentInstance?.startExitAnimation();
  }

  public afterClosed(): Observable<void> {
    return this.#afterClosedVar.asObservable();
  }

  public beforeClose(): Observable<void> {
    return this.#beforeCloseVar.asObservable();
  }
}
