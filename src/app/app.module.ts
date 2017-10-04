import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MdToolbarModule, MdSidenavModule } from '@angular/material';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JWTInterceptor } from './auth/jwt-interceptor';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/shared.service';
import { AppRoutingModule } from './app-routing.module';
import { SpeeddialModule } from './speeddial/speeddial.module';
import { NotificationModule } from './notification/notification.module';
import { AppComponent } from './app.component';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NotificationModule,
    SpeeddialModule,
    MdSidenavModule,
    MdToolbarModule
  ],
  providers: [
     {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
