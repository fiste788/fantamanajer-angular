import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';

@NgModule({
  declarations: [
    ChampionshipRoutingModule.components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChampionshipRoutingModule,
    StreamModule,
  ],
  providers: [
    ChampionshipResolver,
  ],
})
export class ChampionshipModule { }
