import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PlayerComponent } from './player.component';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerService } from './player.service';

@NgModule({
  imports: [
    SharedModule,
    PlayerRoutingModule
  ],
  declarations: [PlayerComponent],
  providers: [PlayerService]
})
export class PlayerModule { }
