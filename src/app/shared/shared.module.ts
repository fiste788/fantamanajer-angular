import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS, FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RellaxDirective, SrcsetDirective, StickyDirective } from '@app/shared/directives';
import { PlaceholderPipe, SrcsetPipe } from '@app/shared/pipes';
import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs-ui';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatEmptyStateComponent } from './components/mat-empty-state/mat-empty-state.component';
import { ParallaxHeaderComponent } from './components/parallax-header/parallax-header.component';
import { RouterOutletComponent } from './components/router-outlet/router-outlet.component';
import { MaterialModule } from './material.module';
import { SharedService } from './services';

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
