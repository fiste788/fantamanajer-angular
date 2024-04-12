import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  numberAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { addVisibleClassOnDestroy } from '@app/functions';
import { StreamService } from '@data/services';
import { StreamActivity } from '@data/types';
import { listItemAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components';

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
  @Input({ required: true }) public context!: 'championships' | 'clubs' | 'teams' | 'users';
  @Input({ required: true, transform: numberAttribute }) public id!: number;

  @ViewChild(CdkVirtualScrollViewport) protected viewport?: CdkVirtualScrollViewport;

  protected backgroundColor = '';
  protected foregroundColor = '';
  protected ds!: StreamDataSource;
  protected width!: number;

  constructor(private readonly streamService: StreamService) {
    addVisibleClassOnDestroy(listItemAnimation);
  }

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  public ngAfterViewInit(): void {
    if (this.viewport) {
      const style = getComputedStyle(this.viewport?.elementRef.nativeElement);
      this.backgroundColor = style.getPropertyValue('--mat-skeleton-background-color');
      this.foregroundColor = style.getPropertyValue('--mat-skeleton-foreground-color');
      this.width = this.viewport.elementRef.nativeElement.clientWidth;
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
