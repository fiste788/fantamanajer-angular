import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipComponent } from './pages/championship/championship.component';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';
import { ChampionshipStreamComponent } from './pages/championship-stream/championship-stream.component';
import { StreamModule } from '@app/modules/stream/stream.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChampionshipComponent,
    ChampionshipStreamComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChampionshipRoutingModule,
    StreamModule
  ],
  providers: [
    ChampionshipResolver
  ]
})
export class ChampionshipModule { }
