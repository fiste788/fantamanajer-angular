import { AnimationEvent } from '@angular/animations';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService } from '@app/http';
import { ApplicationService } from '@app/services';
import { listItemAnimation, openOverlayAnimation } from '@shared/animations';
import { Stream, StreamActivity } from '@shared/models';

@Component({
  animations: [
    openOverlayAnimation,
    listItemAnimation,
  ],
  selector: 'app-notification-overlay',
  styleUrls: ['./notification-list.modal.scss'],
  templateUrl: './notification-list.modal.html',
})
export class NotificationListModal implements OnInit {
  public stream$: Observable<Stream>;
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
  ) { }

  public ngOnInit(): void {
    if (this.app.team) {
      this.stream$ = this.notificationService.getNotifications(this.app.team.id);
    }
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

  public track(_: number, item: StreamActivity): number {
    return _; // or item.id
  }
}
