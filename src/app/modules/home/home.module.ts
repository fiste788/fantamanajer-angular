import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  declarations: [
    HomeRoutingModule.components
  ]
})
export class HomeModule {

}
