import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipComponent } from './championship/championship.component';
import { ChampionshipResolver } from './championship/championship-resolve.service';
import { ChampionshipStreamComponent } from './championship-stream/championship-stream.component';
import { StreamModule } from '../../shared/stream/stream.module';
import { ChampionshipService } from './championship.service';

@NgModule({
  imports: [
    SharedModule,
    ChampionshipRoutingModule,
    StreamModule
  ],
  declarations: [
    ChampionshipComponent,
    ChampionshipStreamComponent
  ],
  providers: [
    ChampionshipService,
    ChampionshipResolver
  ]
})
export class ChampionshipModule { }
