import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';

import { LayoutModule } from '@app/core/layout/layout.module';
import { MainComponent } from '@app/core/layout/main/main.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,

    // 3rd party
    LayoutModule,
    HomeModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
