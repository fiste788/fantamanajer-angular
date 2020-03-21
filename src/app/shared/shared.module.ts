import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS, FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';

import { RellaxDirective, SrcsetDirective, StickyDirective } from '@shared/directives';
import { CaptainPipe, PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatEmptyStateComponent } from './components/mat-empty-state/mat-empty-state.component';
import { ParallaxHeaderComponent } from './components/parallax-header/parallax-header.component';
import { RouterOutletComponent } from './components/router-outlet/router-outlet.component';
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
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    })
  ],
  declarations: [
    RellaxDirective,
    SrcsetDirective,
    StickyDirective,
    SrcsetPipe,
    CaptainPipe,
    PlaceholderPipe,
    ParallaxHeaderComponent,
    BreadcrumbComponent,
    MatEmptyStateComponent,
    RouterOutletComponent
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
    CaptainPipe,
    PlaceholderPipe,
    SrcsetPipe,
    RellaxDirective,
    StickyDirective,
    SrcsetDirective
  ]
})
export class SharedModule { }
