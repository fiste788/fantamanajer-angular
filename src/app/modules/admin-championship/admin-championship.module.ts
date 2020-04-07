import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { ChampionshipModule } from '@modules/championship/championship.module';
import { TeamModule } from '@modules/team/team.module';
import { SharedModule } from '@shared/shared.module';

import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AdminChampionshipRoutingModule,
    ChampionshipModule,
    MatSliderModule,
    TeamModule
  ],
  declarations: [
    AdminChampionshipRoutingModule.components
  ]
})
export class AdminChampionshipModule { }
