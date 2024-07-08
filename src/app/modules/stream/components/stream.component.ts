import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly #streamService = inject(StreamService);

  public context = input.required<'championships' | 'clubs' | 'teams' | 'users'>();
  public id = input.required({ transform: numberAttribute });

  protected viewport = viewChild(CdkVirtualScrollViewport);
  protected ds!: StreamDataSource;
  protected backgroundColor = '';
  protected foregroundColor = '';
  protected width!: number;

  constructor() {
    addVisibleClassOnDestroy(listItemAnimation);
  }

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.#streamService, this.context(), this.id());
  }

  public ngAfterViewInit(): void {
    const viewport = this.viewport();
    if (viewport) {
      const style = getComputedStyle(viewport.elementRef.nativeElement);
      this.backgroundColor = style.getPropertyValue('--mat-skeleton-background-color');
      this.foregroundColor = style.getPropertyValue('--mat-skeleton-foreground-color');
      this.width = viewport.elementRef.nativeElement.clientWidth;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackList(index: number, _item: StreamActivity | undefined): number {
    return index;
  }

  public ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
