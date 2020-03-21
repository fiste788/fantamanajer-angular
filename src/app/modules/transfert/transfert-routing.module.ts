import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransfertListComponent } from './pages/transfert-list/transfert-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransfertListComponent,
    data: { state: 'transfert-list' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfertRoutingModule { }
