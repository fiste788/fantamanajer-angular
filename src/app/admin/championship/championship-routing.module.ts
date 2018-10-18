import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChampionshipComponent } from './championship/championship.component';
import { ChampionshipDetailComponent } from './championship-detail/championship-detail.component';
import { AddTeamComponent } from './add-team/add-team.component';

const routes: Routes = [
  {
    path: '',
    component: ChampionshipComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: HomeComponent },
      { path: 'add-team', component: AddTeamComponent },
      { path: 'edit', component: ChampionshipDetailComponent },
      {
        path: 'new',
        component: ChampionshipDetailComponent,
        data: {
          breadcrumbs: 'Nuovo lega'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChampionshipRoutingModule { }
