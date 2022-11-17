import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeRoutingModule.components],
  imports: [SharedModule, HomeRoutingModule, MatProgressSpinnerModule, MatExpansionModule],
})
export class HomeModule {}
