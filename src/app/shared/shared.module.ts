import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { MaterialModule } from './material.module';
import { ParallaxHeaderComponent } from './components/parallax-header/parallax-header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatEmptyStateComponent } from './components/mat-empty-state/mat-empty-state.component';
import { SrcsetPipe, PlaceholderPipe } from '@app/core/pipes';
import { RellaxDirective, SrcsetDirective } from '@app/core/directives';
import { SharedService } from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,

    McBreadcrumbsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    })
  ],
  declarations: [
    RellaxDirective,
    SrcsetDirective,
    SrcsetPipe,
    PlaceholderPipe,
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    MatEmptyStateComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,

    FlexLayoutModule,
    McBreadcrumbsModule,
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    MatEmptyStateComponent,
    LazyLoadImageModule,
    PlaceholderPipe,
    SrcsetPipe,
    RellaxDirective,
    SrcsetDirective
  ],
  providers: [
    SharedService
  ]

})
export class SharedModule { }
