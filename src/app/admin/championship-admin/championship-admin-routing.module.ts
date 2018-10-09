import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChampionshipAdminComponent } from './championship-admin/championship-admin.component';
import { ChampionshipDetailComponent } from './championship-detail/championship-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ChampionshipAdminComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: HomeComponent },
      { path: 'edit', component: ChampionshipDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChampionshipAdminRoutingModule { }
