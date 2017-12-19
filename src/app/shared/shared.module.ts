import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedService } from './shared.service';
import { ParallaxHeaderComponent } from './parallax-header/parallax-header.component';
import { RellaxModule } from './rellax/rellax.module';
import { SrcsetDirective } from './srcset.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    RellaxModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    ParallaxHeaderComponent,
    RellaxModule,
    SrcsetDirective
  ],
  declarations: [ParallaxHeaderComponent, SrcsetDirective]
})
export class SharedModule { }
