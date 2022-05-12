import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { MainComponent } from './layout/components/main/main.component';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  bootstrap: [MainComponent],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,

    // 3rd party
    LayoutModule,

    // core & shared
    CoreModule,

    // app
    AppRoutingModule,
  ],
})
export class AppModule {}
