import { NgModule } from '@angular/core';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';

import { SharedModule } from '@shared/shared.module';

import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';

@NgModule({
  declarations: [AdminChampionshipRoutingModule.components],
  imports: [SharedModule, AdminChampionshipRoutingModule, MatSliderModule],
})
export class AdminChampionshipModule {}
