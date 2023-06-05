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
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { StreamService } from '@data/services';
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
  styleUrls: ['./stream.component.scss'],
  templateUrl: './stream.component.html',
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true }) public context!: 'teams' | 'users' | 'clubs' | 'championships';
  @Input({ required: true }) public id!: number;

  @ViewChild(CdkVirtualScrollViewport) protected viewport?: CdkVirtualScrollViewport;

  protected ds!: StreamDataSource;
  protected width!: number;

  constructor(private readonly streamService: StreamService) {}

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  public ngAfterViewInit(): void {
    if (this.viewport) {
      this.width = this.viewport.elementRef.nativeElement.clientWidth;
    }
  }

  public ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
