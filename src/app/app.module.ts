import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import 'hammerjs';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    SharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js'),
    /*environment.production
      ? ServiceWorkerModule.register('/ngsw-worker.js')
      : [],*/
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
