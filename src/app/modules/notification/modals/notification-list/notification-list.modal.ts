import { AnimationEvent } from '@angular/animations';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService } from '@app/http';
import { ApplicationService } from '@app/services';
import { listItemAnimation, openOverlayAnimation } from '@shared/animations';
import { Stream, StreamActivity } from '@shared/models';

@Component({
  selector: 'fm-notification-overlay',
  templateUrl: './notification-list.modal.html',
  styleUrls: ['./notification-list.modal.scss'],
  animations: [
    openOverlayAnimation,
    listItemAnimation
  ]
})
export class NotificationListModal implements OnInit {
  stream$: Observable<Stream>;
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService
  ) { }

  ngOnInit(): void {
    if (this.app.team) {
      this.stream$ = this.notificationService.getNotifications(this.app.team.id);
    }
  }

  onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation(): void {
    this.animationState = 'leave';
  }

  track(_: number, item: StreamActivity): number {
    return _; // or item.id
  }
}
