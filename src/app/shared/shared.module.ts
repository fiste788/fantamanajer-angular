import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, DEFAULT_BREAKPOINTS, BREAKPOINTS } from '@angular/flex-layout';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { SrcsetPipe, PlaceholderPipe } from '@app/shared/pipes';
import { RellaxDirective, SrcsetDirective, StickyDirective } from '@app/shared/directives';
import { MaterialModule } from './material.module';
import { ParallaxHeaderComponent } from './components/parallax-header/parallax-header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatEmptyStateComponent } from './components/mat-empty-state/mat-empty-state.component';
import { SharedService } from './services';
import { RouterOutletComponent } from './components/router-outlet/router-outlet.component';

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
    PlaceholderPipe,
    SrcsetPipe,
    RellaxDirective,
    StickyDirective,
    SrcsetDirective
  ],
  providers: [
    SharedService
  ]

})
export class SharedModule { }
