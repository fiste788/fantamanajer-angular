import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage, data: {
      state: 'home',
    },
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule {
  public static components = [
    HomePage,
  ];
}
