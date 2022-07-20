import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { StreamService } from '@data/services';
import { listItemAnimation } from '@shared/animations';

import { StreamDataSource } from './stream.datasource';

@Component({
  animations: [listItemAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream[context][id]',
  styleUrls: ['./stream.component.scss'],
  templateUrl: './stream.component.html',
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public context!: 'teams' | 'users' | 'clubs' | 'championships';
  @Input() public id!: number;

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
