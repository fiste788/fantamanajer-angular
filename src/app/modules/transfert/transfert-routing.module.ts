import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransfertListPage } from './pages/transfert-list/transfert-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransfertListPage,
    data: { state: 'transfert-list' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfertRoutingModule {
  static components = [
    TransfertListPage
  ];
}
