import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@app/shared/layout/layout.module';
import { MainComponent } from '@app/shared/layout/main/main.component';
import { HomeComponent } from './home/home.component';
// import 'hammerjs';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    // angular
    BrowserModule,
    //BrowserAnimationsModule,

    // 3rd party
    LayoutModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
