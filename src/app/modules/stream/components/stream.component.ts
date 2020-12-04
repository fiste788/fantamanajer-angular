import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { StreamService } from '@data/services';
import { listItemAnimation } from '@shared/animations';

import { StreamDataSource } from './stream.datasource';

@Component({
  animations: [listItemAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream',
  styleUrls: ['./stream.component.scss'],
  templateUrl: './stream.component.html',
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public context: 'teams' | 'users' | 'clubs' | 'championships';
  @Input() public id: number;

  @ViewChild(CdkVirtualScrollViewport) public viewport: CdkVirtualScrollViewport;

  public ds: StreamDataSource;
  public width: number;

  constructor(private readonly streamService: StreamService) { }

  public ngOnInit(): void {
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  public ngAfterViewInit(): void {
    this.width = this.viewport.elementRef.nativeElement.clientWidth;
  }

  public ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
