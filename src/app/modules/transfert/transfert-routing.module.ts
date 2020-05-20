import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTransfertShortcutPage } from './pages/add-transfert-shortcut/add-transfert-shortcut.page';
import { TransfertListPage } from './pages/transfert-list/transfert-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransfertListPage,
    data: { state: 'transfert-list' }
  },
  {
    path: 'new',
    component: AddTransfertShortcutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfertRoutingModule {
  static components = [
    TransfertListPage,
    AddTransfertShortcutPage
  ];
}
