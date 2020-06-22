import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS, FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';

import { RellaxDirective, SrcsetDirective, StickyDirective } from '@shared/directives';
import { CaptainPipe, PlaceholderPipe, RangePipe, SrcsetPipe, StatePipe } from '@shared/pipes';

import { BreadcrumbComponent, MatEmptyStateComponent, ParallaxHeaderComponent, PlayerImageComponent, RouterOutletComponent } from './components';
import { MaterialModule } from './material.module';

export const breakPointsProvider = {
  provide: BREAKPOINTS,
  useValue: DEFAULT_BREAKPOINTS,
  multi: true
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,

    FlexLayoutModule,
    McBreadcrumbsModule,
    LazyLoadImageModule
  ],
  declarations: [
    RellaxDirective,
    SrcsetDirective,
    StickyDirective,

    CaptainPipe,
    PlaceholderPipe,
    RangePipe,
    SrcsetPipe,
    StatePipe,

    BreadcrumbComponent,
    MatEmptyStateComponent,
    ParallaxHeaderComponent,
    PlayerImageComponent,
    RouterOutletComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    McBreadcrumbsModule,
    LazyLoadImageModule,

    RellaxDirective,
    SrcsetDirective,
    StickyDirective,

    CaptainPipe,
    PlaceholderPipe,
    RangePipe,
    SrcsetPipe,
    StatePipe,

    BreadcrumbComponent,
    MatEmptyStateComponent,
    ParallaxHeaderComponent,
    PlayerImageComponent
  ]
})
export class SharedModule { }
