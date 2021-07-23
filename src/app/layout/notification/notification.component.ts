import { Compiler, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';

import { NotificationService } from '@data/services';
import { ApplicationService } from '@app/services';
import { createBoxAnimation } from '@shared/animations';
import { Stream, Team } from '@data/types';

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
    this.stream$ = this.app.teamChange$.pipe(
      filter((t): t is Team => t !== undefined),
      switchMap((t) => this.notificationService.getNotificationCount(t.id)),
    );
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
  }
}
