import { ENVIRONMENT_INITIALIZER, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApplicationService, PushService, PwaService, ThemeService } from '@app/services';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { MainComponent } from './layout/components/main/main.component';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  bootstrap: [MainComponent],
  imports: [
    // angular
    AppRoutingModule,
    BrowserAnimationsModule,

    // 3rd party
    BrowserModule,

    // core & shared
    CoreModule,
    LayoutModule,

    // app
    SharedModule,
  ],
  providers: [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(ApplicationService).connect();
        inject(BreadcrumbService).connect('FantaManajer');
        inject(PwaService).connect();
        inject(PushService).connect();
        inject(ThemeService).connect();
      },
    },
  ],
})
export class AppModule {}
