import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerResolver } from './pages/player/player-resolver.service';
import { PlayerPage } from './pages/player/player.page';

const routes: Routes = [
  { path: '', component: PlayerPage, data: { state: 'player' } },
  {
    path: ':id',
    component: PlayerPage,
    data: {
      // eslint-disable-next-line no-template-curly-in-string
      breadcrumbs: '${player.full_name}',
      state: 'player-detail',
    },
    resolve: {
      player: PlayerResolver,
    },
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PlayerRoutingModule {
  public static components = [PlayerPage];
}
