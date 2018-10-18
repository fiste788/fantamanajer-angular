import { NgModule } from '@angular/core';
import { LineupComponent } from './lineup/lineup.component';
import { RouterModule, Routes } from '@angular/router';
import { LineupLastComponent } from './lineup-last/lineup-last.component';

const routes: Routes = [
  {
    path: '',
    component: LineupComponent,
    children: [
      { path: 'current', component: LineupLastComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineupRoutingModule { }
