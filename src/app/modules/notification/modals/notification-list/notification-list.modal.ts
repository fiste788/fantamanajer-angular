import { AnimationEvent } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { listItemAnimation, openOverlayAnimation } from '@shared/animations';

@Component({
  animations: [openOverlayAnimation, listItemAnimation],
  selector: 'app-notification-overlay',
  styleUrls: ['./notification-list.modal.scss'],
  templateUrl: './notification-list.modal.html',
})
export class NotificationListModal {
  @Output() readonly seen: EventEmitter<Stream> = new EventEmitter<Stream>();

  public stream$: Observable<Stream>;
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
  ) {
    this.stream$ = this.loadData();
  }

  public loadData(): Observable<Stream> {
    return this.app.requireTeam$.pipe(
      switchMap((t) => this.notificationService.getNotifications(t.id)),
      tap((res) => {
        this.seen.emit(res);
      }),
    );
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public track(_: number): number {
    return _; // or item.id
  }
}
