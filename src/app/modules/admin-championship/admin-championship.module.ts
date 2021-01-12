import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { SharedModule } from '@shared/shared.module';

import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';

@NgModule({
  declarations: [AdminChampionshipRoutingModule.components],
  imports: [SharedModule, AdminChampionshipRoutingModule, MatSliderModule],
})
export class AdminChampionshipModule {}
