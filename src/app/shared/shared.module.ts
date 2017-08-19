import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MaterialModule, MdIconModule, MdTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NguiParallaxScrollModule } from '@ngui/parallax-scroll';
import { SharedService } from './shared.service';
import { ParallaxHeaderComponent } from './parallax-header/parallax-header.component';
import { RellaxModule } from './rellax/rellax.module';
// import { ng2Parallax } from '../../../node_modules/ang2-parallax/ng2parallax';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NguiParallaxScrollModule,
    RellaxModule,
  ],
  exports: [
    MaterialModule,
    MdTableModule,
    CdkTableModule,
    MdIconModule,
    FormsModule,
    HttpModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    ParallaxHeaderComponent,
    RellaxModule
  ],
  declarations: [ParallaxHeaderComponent],
  // providers: [SharedService]
})
export class SharedModule { }
