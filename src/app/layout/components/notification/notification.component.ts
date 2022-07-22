import {
  Component,
  createNgModule,
  ElementRef,
  Injector,
  NgModuleRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { NotificationModule } from '@modules/notification/notification.module';
import { createBoxAnimation } from '@shared/animations';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @ViewChild('container', { read: ViewContainerRef }) protected container?: ViewContainerRef;

  protected readonly stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
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
      const ngModule = await import('@modules/notification/notification.module').then(
        (m) => m.NotificationModule,
      );

      const ngModuleRef: NgModuleRef<NotificationModule> = createNgModule(ngModule, this.injector);
      const componentRef = this.container.createComponent(ngModule.rootComponent, {
        ngModuleRef,
      });
      componentRef.instance.open(new ElementRef(el));
    }
  }
}
