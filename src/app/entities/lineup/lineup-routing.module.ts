import { NgModule } from '@angular/core';
import { LineupComponent } from './lineup/lineup.component';
import { LineupDetailComponent } from './lineup-detail/lineup-detail.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    component: LineupComponent,
    children: [
      { path: 'current', component: LineupDetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineupRoutingModule {}
