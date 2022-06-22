import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS, FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {
  RellaxDirective,
  SeasonActiveDirective,
  SrcsetDirective,
  StickyDirective,
} from '@shared/directives';
import { CaptainPipe, PlaceholderPipe, RangePipe, SrcsetPipe, StatePipe } from '@shared/pipes';

import {
  BreadcrumbComponent,
  MatEmptyStateComponent,
  ParallaxHeaderComponent,
  PlayerImageComponent,
  RouterOutletComponent,
} from './components';
import { MaterialModule } from './material.module';

export const breakPointsProvider = {
  provide: BREAKPOINTS,
  useValue: DEFAULT_BREAKPOINTS,
};

@NgModule({
  declarations: [
    RellaxDirective,
    SeasonActiveDirective,
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
    RouterOutletComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    LazyLoadImageModule,

    RellaxDirective,
    SeasonActiveDirective,
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
    RouterOutletComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,

    FlexLayoutModule,
    LazyLoadImageModule,
  ],
})
export class SharedModule {}
