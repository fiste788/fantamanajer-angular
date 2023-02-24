import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
  declarations: [PlayerRoutingModule.components],
  imports: [PlayerRoutingModule, SharedModule],
})
export default class PlayerModule {}
