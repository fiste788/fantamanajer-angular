import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { SharedModule } from '@shared/shared.module';

import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AdminChampionshipRoutingModule,
    MatSliderModule
  ],
  declarations: [
    AdminChampionshipRoutingModule.components
  ]
})
export class AdminChampionshipModule { }
