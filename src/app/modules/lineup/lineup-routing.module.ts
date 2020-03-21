import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { LineupLastComponent } from './pages/lineup-last/lineup-last.component';

const routes: Routes = [
  {
    path: '',
    data: { state: 'lineup-outlet' },
    component: RouterOutletComponent,
    children: [
      { path: 'current', component: LineupLastComponent, data: { state: 'lineup-detail' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineupRoutingModule { }
