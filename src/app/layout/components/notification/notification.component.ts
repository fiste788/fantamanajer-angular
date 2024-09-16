import { NgIf, AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewContainerRef,
  viewChild,
  inject,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, EMPTY, filter, Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { NotificationListComponent } from '@modules/notification/components/notification-list/notification-list.component';
import { createBoxAnimation } from '@shared/animations';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    SeasonActiveDirective,
    AsyncPipe,
    DecimalPipe,
    NotificationListComponent,
  ],
})
export class NotificationComponent {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #notificationService = inject(NotificationService);
  readonly #app = inject(ApplicationService);

  protected container = viewChild<unknown, ViewContainerRef>('container', {
    read: ViewContainerRef,
  });

  protected buttonRef = viewChild.required<unknown, ElementRef>('button', { read: ElementRef });
  protected readonly stream$ = this.#isBrowser ? this.loadStream() : EMPTY;

  public loadStream(): Observable<Stream> {
    return combineLatest([this.#app.requireTeam$, this.#app.matchday$]).pipe(
      filter(([team, matchday]) => team.championship.season_id === matchday.season_id),
      switchMap(([team]) => this.#notificationService.getNotificationCount(team.id)),
    );
  }
}
