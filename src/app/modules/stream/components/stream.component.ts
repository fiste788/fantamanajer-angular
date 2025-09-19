import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  afterNextRender,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { StreamActivity } from '@data/types';
import { LayoutService } from '@layout/services';
import { ContentLoaderComponent } from '@shared/components/content-loader';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

import { StreamDataSource } from './stream.datasource';

@Component({
  imports: [
    ContentLoaderComponent,
    ScrollingModule,
    MatListModule,
    MatIconModule,
    DatePipe,
    MatEmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream[context][id]',
  styleUrl: './stream.component.scss',
  templateUrl: './stream.component.html',
})
export class StreamComponent implements OnInit, OnDestroy {
  readonly #layoutService = inject(LayoutService);
  readonly #injector = inject(Injector);

  public context = input.required<'championships' | 'clubs' | 'teams' | 'users'>();
  public id = input.required({ transform: numberAttribute });

  protected viewport = viewChild(CdkVirtualScrollViewport);
  protected ds!: StreamDataSource;
  protected skeletonColors = this.#layoutService.skeletonColors;
  protected width!: number;

  constructor() {
    afterNextRender(() => {
      const viewport = this.viewport();
      if (viewport) {
        this.width = viewport.elementRef.nativeElement.clientWidth;
      }
    });
  }

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.#injector, this.context(), this.id());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackList(index: number, _item?: StreamActivity): number {
    return index;
  }

  public ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
