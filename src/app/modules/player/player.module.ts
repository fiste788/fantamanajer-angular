import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
  declarations: [
    PlayerRoutingModule.components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlayerRoutingModule,
  ],
  providers: [
    PlayerResolver,
  ],
})
export class PlayerModule { }
