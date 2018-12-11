import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { PlayerComponent } from './pages/player/player.component';
import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PlayerRoutingModule
  ],
  declarations: [
    PlayerComponent
  ],
  providers: [
    PlayerResolver
  ]
})
export class PlayerModule { }
