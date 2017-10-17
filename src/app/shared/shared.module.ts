import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import {
  MatSlideToggleModule,
  MatTooltipModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatIconModule,
  MatListModule,
  MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NguiParallaxScrollModule } from '@ngui/parallax-scroll';
import { SharedService } from './shared.service';
import { ParallaxHeaderComponent } from './parallax-header/parallax-header.component';
import { RellaxModule } from './rellax/rellax.module';
// import { ng2Parallax } from '../../../node_modules/ang2-parallax/ng2parallax';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatListModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    CdkTableModule,
    MatSelectModule,
    MatIconModule,
    NguiParallaxScrollModule,
    RellaxModule,
  ],
  exports: [
    MatSlideToggleModule,
    MatTooltipModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    CdkTableModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    ParallaxHeaderComponent,
    RellaxModule
  ],
  declarations: [ParallaxHeaderComponent],
  /*providers: [
    {
     provide: HTTP_INTERCEPTORS,
     useClass: JWTInterceptor,
     multi: true
   }
 ],*/
  // providers: [SharedService]
})
export class SharedModule { }
