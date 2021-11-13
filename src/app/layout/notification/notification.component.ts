import { Compiler, Component, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { NotificationListComponent } from '@modules/notification/components/notification-list/notification-list.component';
import { createBoxAnimation } from '@shared/animations';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @ViewChild('container', { read: ViewContainerRef }) public container?: ViewContainerRef;

  public stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly compiler: Compiler,
    private readonly injector: Injector,
  ) {
    this.stream$ = this.loadStream();
  }

  public loadStream(): Observable<Stream> {
    return this.app.requireTeam$.pipe(
      switchMap((t) => this.notificationService.getNotificationCount(t.id)),
    );
  }

  public async open(el: EventTarget | null): Promise<void> {
    if (this.container) {
      const m = await import('@modules/notification/notification.module');
      const mf = await this.compiler.compileModuleAsync(m.NotificationModule);

      const ref = this.container.createComponent(NotificationListComponent, {
        ngModuleRef: mf.create(this.injector),
      });
      ref.instance.open(el);
    }
  }
}
