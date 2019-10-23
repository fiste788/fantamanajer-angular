import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '@app/shared/shared.module';
import { TeamModule } from '@app/modules/team/team.module';
import { ChampionshipModule } from '@app/modules/championship/championship.module';
import { AdminChampionshipRoutingModule } from './admin-championship-routing.module';
import { ChampionshipDetailComponent } from './pages/championship-detail/championship-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { AddTeamComponent } from './pages/add-team/add-team.component';

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
