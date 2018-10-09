import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '../../shared/shared.module';
import { ChampionshipModule } from '../../entities/championship/championship.module';
import { ChampionshipAdminRoutingModule } from './championship-admin-routing.module';
import { ChampionshipAdminComponent } from './championship-admin/championship-admin.component';
import { ChampionshipDetailComponent } from './championship-detail/championship-detail.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    SharedModule,
    ChampionshipAdminRoutingModule,
    ChampionshipModule,
    MatSliderModule
  ],
  declarations: [
    ChampionshipAdminComponent,
    ChampionshipDetailComponent,
    HomeComponent
  ]
})
export class ChampionshipAdminModule { }
