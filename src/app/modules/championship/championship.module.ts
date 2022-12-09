import { NgModule } from '@angular/core';

import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipResolver } from './pages/championship/championship-resolve.service';

@NgModule({
  declarations: [ChampionshipRoutingModule.components],
  imports: [ChampionshipRoutingModule, SharedModule, StreamComponent],
  providers: [ChampionshipResolver],
})
export default class ChampionshipModule {}
