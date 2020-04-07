import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PlayerRoutingModule
  ],
  declarations: [
    PlayerRoutingModule.components
  ],
  providers: [
    PlayerResolver
  ]
})
export class PlayerModule { }
