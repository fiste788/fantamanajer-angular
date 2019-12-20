import { Component, OnInit, EventEmitter } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Observable } from 'rxjs';
import { NotificationService, ApplicationService } from '@app/core/services';
import { Stream } from '@app/core/models';
import { listItemAnimation, openOverlayAnimation } from '@app/core/animations';


@Component({
  selector: 'fm-notification-overlay',
  templateUrl: './notification-overlay.component.html',
  styleUrls: ['./notification-overlay.component.scss'],
  animations: [
    openOverlayAnimation,
    listItemAnimation
  ],
})
export class NotificationOverlayComponent implements OnInit {
  public stream: Observable<Stream>;
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    public notificationService: NotificationService,
    private app: ApplicationService) { }

  ngOnInit() {
    if (this.app.team) {
      this.stream = this.notificationService.getNotifications(this.app.team.id);
    }
  }

  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation() {
    this.animationState = 'leave';
  }

}
