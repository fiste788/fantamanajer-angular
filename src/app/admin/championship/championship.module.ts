import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '../../shared/shared.module';
import { ChampionshipModule as ChampionshipEntityModule } from '../../entities/championship/championship.module';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipComponent } from './championship/championship.component';
import { ChampionshipDetailComponent } from './championship-detail/championship-detail.component';
import { HomeComponent } from './home/home.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { TeamModule } from '../../entities/team/team.module';

@NgModule({
  imports: [
    SharedModule,
    ChampionshipRoutingModule,
    ChampionshipEntityModule,
    MatSliderModule,
    TeamModule
  ],
  declarations: [
    ChampionshipComponent,
    ChampionshipDetailComponent,
    HomeComponent,
    AddTeamComponent
  ]
})
export class ChampionshipModule { }
