import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipComponent } from './championship/championship.component';
import { ChampionshipResolver } from './championship/championship-resolve.service';

@NgModule({
  imports: [
    SharedModule,
    ChampionshipRoutingModule
  ],
  declarations: [
    ChampionshipComponent
  ],
  providers: [
    ChampionshipResolver
  ]
})
export class ChampionshipModule { }
