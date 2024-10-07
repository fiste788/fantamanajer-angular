import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { ContentLoaderModule } from '@ngneat/content-loader';

import { addVisibleClassOnDestroy } from '@app/functions';
import { StreamService } from '@data/services';
import { StreamActivity } from '@data/types';
import { listItemAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { LayoutService } from 'src/app/layout/services';

import { StreamDataSource } from './stream.datasource';

@Component({
  animations: [listItemAnimation],
  standalone: true,
  imports: [
    ContentLoaderModule,
    ScrollingModule,
    NgIf,
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
  readonly #streamService = inject(StreamService);
  readonly #layoutService = inject(LayoutService);

  public context = input.required<'championships' | 'clubs' | 'teams' | 'users'>();
  public id = input.required({ transform: numberAttribute });

  protected viewport = viewChild(CdkVirtualScrollViewport);
  protected ds!: StreamDataSource;
  protected skeletonColors = this.#layoutService.skeletonColors;
  protected width!: number;

  constructor() {
    addVisibleClassOnDestroy(listItemAnimation);
  }

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.#streamService, this.context(), this.id());
    afterNextRender(() => {
      const viewport = this.viewport();
      if (viewport) {
        this.width = viewport.elementRef.nativeElement.clientWidth;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackList(index: number, _item?: StreamActivity): number {
    return index;
  }

  public ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
