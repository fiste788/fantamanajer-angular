import { NgModule } from '@angular/core';

import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { ChampionshipRoutingModule } from './championship-routing.module';

@NgModule({
  declarations: [ChampionshipRoutingModule.components],
  imports: [ChampionshipRoutingModule, SharedModule, StreamComponent],
})
export default class ChampionshipModule {}
