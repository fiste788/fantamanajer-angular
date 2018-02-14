import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PlayerComponent } from './player/player.component';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerService } from './player.service';
import { PlayerResolver } from './player/player-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    PlayerRoutingModule
  ],
  declarations: [PlayerComponent],
  providers: [
    PlayerService,
    PlayerResolver
  ]
})
export class PlayerModule { }
