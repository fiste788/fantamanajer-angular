import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage, data: { state: 'home' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
  static components = [
    HomePage
  ];
}
