import { Compiler, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService } from '@data/services';
import { ApplicationService } from '@app/services';
import { createBoxAnimation } from '@shared/animations';
import { Stream } from '@data/types';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) public container: ViewContainerRef;

  public stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly compiler: Compiler,
    private readonly injector: Injector,
  ) {}

  public ngOnInit(): void {
    if (this.app.team) {
      this.stream$ = this.notificationService.getNotificationCount(this.app.team.id);
    }
  }

  public seen(): void {
    this.stream$ = this.notificationService.seen;
  }

  public async open(el: EventTarget | null): Promise<void> {
    const module = await import('@modules/notification/notification.module').then(async (m) =>
      this.compiler.compileModuleAsync(m.NotificationModule),
    );

    const elementModuleRef = module.create(this.injector);
    const moduleInstance = elementModuleRef.instance;

    const componentFactory = moduleInstance.resolveComponent();
    const ref = this.container.createComponent(
      componentFactory,
      undefined,
      elementModuleRef.injector,
    );
    ref.instance.open(el);
    this.notificationService.seen.subscribe();
  }
}
