import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerComponent } from './pages/player/player.component';

const routes: Routes = [
  { path: '', component: PlayerComponent, data: { state: 'player' } },
  {
    path: ':id',
    component: PlayerComponent,
    resolve: {
      player: PlayerResolver
    },
    data: {
      state: 'player-detail',
      breadcrumbs: '{{ player.full_name }}'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
