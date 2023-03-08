import { AnimationEvent } from '@angular/animations';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { listItemAnimation, openOverlayAnimation } from '@shared/animations';

import { MatEmptyStateComponent } from '../../../../shared/components/mat-empty-state/mat-empty-state.component';

@Component({
  animations: [openOverlayAnimation, listItemAnimation],
  selector: 'app-notification-overlay',
  styleUrls: ['./notification-list.modal.scss'],
  templateUrl: './notification-list.modal.html',
  standalone: true,
  imports: [
    NgIf,
    MatListModule,
    NgFor,
    MatIconModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
  ],
})
export class NotificationListModal {
  @Output() public readonly seen: EventEmitter<Stream> = new EventEmitter<Stream>();
  @Output() public readonly animationStateChanged = new EventEmitter<AnimationEvent>();

  protected readonly stream$: Observable<Stream>;
  protected animationState: 'void' | 'enter' | 'leave' = 'enter';

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
