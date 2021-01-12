import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { EditMembersPage } from './pages/edit-members/edit-members.page';
import { HomePage } from './pages/home/home.page';
import { NewTransfertPage } from './pages/new-transfert/new-transfert.page';
import { ScoreEditPage } from './pages/score-edit/score-edit.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index',
      },
      {
        path: 'index',
        component: HomePage,
        data: {
          state: 'admin-team-index',
        },
      },
      {
        path: 'members',
        component: EditMembersPage,
        data: {
          state: 'admin-team-members',
        },
      },
      {
        path: 'new_transfert',
        component: NewTransfertPage,
        data: {
          state: 'admin-new-transferts',
        },
      },
      {
        path: 'score/edit',
        component: ScoreEditPage,
        data: {
          state: 'admin-score-edit',
        },
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AdminTeamRoutingModule {
  public static components = [HomePage, EditMembersPage, NewTransfertPage, ScoreEditPage];
}
