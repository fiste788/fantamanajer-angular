import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { MaterialModule } from './material.module';
import { ParallaxHeaderComponent } from './parallax-header/parallax-header.component';
import { RellaxModule } from './rellax/rellax.module';
import { SrcsetDirective } from './srcset/srcset.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MatEmptyStateComponent } from './mat-empty-state/mat-empty-state.component';
import { SrcsetPipe } from './srcset/srcset.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    McBreadcrumbsModule,
    MaterialModule,
    RellaxModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    })
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
    SrcsetDirective,
    SrcsetPipe,
    MatEmptyStateComponent,
    LazyLoadImageModule
  ],
  declarations: [
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    SrcsetDirective,
    SrcsetPipe,
    MatEmptyStateComponent,
  ]
})
export class SharedModule { }
