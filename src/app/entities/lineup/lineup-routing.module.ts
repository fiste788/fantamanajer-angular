import { NgModule } from '@angular/core';
import { LineupComponent } from './lineup/lineup.component';
import { RouterModule, Routes } from '@angular/router';
import { LineupLastComponent } from './lineup-last/lineup-last.component';

const routes: Routes = [
  {
    path: '',
    data: { state: 'lineup' },
    component: LineupComponent,
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
