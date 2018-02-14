import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedService } from './shared.service';
import { ParallaxHeaderComponent } from './parallax-header/parallax-header.component';
import { RellaxModule } from './rellax/rellax.module';
import { SrcsetDirective } from './srcset.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    McBreadcrumbsModule,
    MaterialModule,
    RellaxModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    McBreadcrumbsModule,
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    RellaxModule,
    SrcsetDirective
  ],
  declarations: [
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    SrcsetDirective,
  ]
})
export class SharedModule { }
