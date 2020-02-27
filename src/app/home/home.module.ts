import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@app/shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  exports: [
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  declarations: [
    HomeComponent
  ]

})
export class HomeModule {

}
