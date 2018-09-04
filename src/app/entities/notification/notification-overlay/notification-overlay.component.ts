import { Component, OnInit, EventEmitter } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ApplicationService } from '../../../core/application.service';
import { Stream } from '../../../shared/stream/stream';
import { ListItemAnimation } from '../../../shared/animations/list-item.animation';
import { Observable } from 'rxjs';
import { OpenOverlayAnimation } from '../../../shared/animations/open-overlay.animation';
import { AnimationEvent } from '@angular/animations';


@Component({
  selector: 'fm-notification-overlay',
  templateUrl: './notification-overlay.component.html',
  styleUrls: ['./notification-overlay.component.scss'],
  animations: [
    OpenOverlayAnimation,
    ListItemAnimation
  ],
})
export class NotificationOverlayComponent implements OnInit {
  public stream: Observable<Stream>;
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(public notificationService: NotificationService,
    private app: ApplicationService) { }

  ngOnInit() {
    this.stream = this.notificationService.getNotifications(this.app.team.id);
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
