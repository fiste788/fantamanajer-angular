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
    BreadcrumbComponent,
    CaptainPipe,
    MatEmptyStateComponent,
    ParallaxHeaderComponent,

    PlaceholderPipe,
    PlayerImageComponent,
    RangePipe,
    RellaxDirective,
    RouterOutletComponent,
    SeasonActiveDirective,
    SrcsetDirective,

    SrcsetPipe,
    StatePipe,
    StickyDirective,
  ],
  exports: [
    BreadcrumbComponent,
    CaptainPipe,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    LazyLoadImageModule,

    MatEmptyStateComponent,
    MaterialModule,
    ParallaxHeaderComponent,
    PlaceholderPipe,
    PlayerImageComponent,
    RangePipe,
    RellaxDirective,

    RouterModule,
    RouterOutletComponent,
    SeasonActiveDirective,
    SrcsetDirective,
    SrcsetPipe,
    StatePipe,

    StickyDirective,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    LazyLoadImageModule,

    MaterialModule,
    RouterModule,
  ],
})
export class SharedModule {}
