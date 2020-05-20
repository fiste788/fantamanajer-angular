import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { AddLineupShortcutPage } from './pages/add-lineup-shortcut/add-lineup-shortcut.page';
import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

const routes: Routes = [
  {
    path: '',
    data: { state: 'lineup-outlet' },
    component: RouterOutletComponent,
    children: [
      {
        path: 'current',
        component: LineupLastPage,
        data: {
          state: 'lineup-detail'
        }
      },
      {
        path: 'new',
        component: AddLineupShortcutPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineupRoutingModule {
  static components = [
    LineupLastPage,
    AddLineupShortcutPage
  ];
}
