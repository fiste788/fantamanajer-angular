import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFactory, ComponentFactoryResolver, NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationListModal } from './modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from './services/notification-overlay.service';

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationListModal,
  ],
  exports: [
    NotificationListComponent,
  ],
  imports: [
    SharedModule,
    OverlayModule,
  ],
  providers: [NotificationOverlayService],
})
export class NotificationModule {
  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) { }

  public resolveComponent(): ComponentFactory<NotificationListComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(NotificationListComponent);
  }
}
