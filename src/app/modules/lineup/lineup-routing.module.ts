import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineupComponent } from './pages/lineup/lineup.component';
import { LineupLastComponent } from './pages/lineup-last/lineup-last.component';

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
