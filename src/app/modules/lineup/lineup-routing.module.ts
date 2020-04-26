import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

const routes: Routes = [
  {
    path: '',
    data: { state: 'lineup-outlet' },
    component: RouterOutletComponent,
    children: [
      { path: 'current', component: LineupLastPage, data: { state: 'lineup-detail' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineupRoutingModule {
  static components = [
    LineupLastPage
  ];
}
