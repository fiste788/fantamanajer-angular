import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipComponent } from './championship.component';

@NgModule({
  imports: [
    SharedModule,
    ChampionshipRoutingModule
  ],
  declarations: [ChampionshipComponent]
})
export class ChampionshipModule { }
