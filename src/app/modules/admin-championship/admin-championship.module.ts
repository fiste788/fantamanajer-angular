import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { ChampionshipModule } from '@modules/championship/championship.module';
import { TeamModule } from '@modules/team/team.module';
import { SharedModule } from '@shared/shared.module';

import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';
import { AddTeamComponent } from './pages/add-team/add-team.component';
import { ChampionshipDetailComponent } from './pages/championship-detail/championship-detail.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  imports: [
    SharedModule,
    AdminChampionshipRoutingModule,
    ChampionshipModule,
    MatSliderModule,
    TeamModule
  ],
  declarations: [
    ChampionshipDetailComponent,
    HomeComponent,
    AddTeamComponent
  ]
})
export class AdminChampionshipModule { }
