import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerPage } from './pages/player/player.page';

const routes: Routes = [
  { path: '', component: PlayerPage, data: { state: 'player' } },
  {
    path: ':id',
    component: PlayerPage,
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
export class PlayerRoutingModule {
  static components = [
    PlayerPage
  ];
}
