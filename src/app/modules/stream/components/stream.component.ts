import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StreamService } from '@app/core/http';
import { listItemAnimation } from '@app/shared/animations/list-item.animation';
import { StreamDataSource } from './stream.datasource';

@Component({
  selector: 'fm-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  animations: [listItemAnimation]
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  ds: StreamDataSource;
  width: number;
  @Input() context: 'teams' | 'users' | 'clubs' | 'championships';
  @Input() id: number;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(private readonly streamService: StreamService) { }

  ngOnInit(): void {
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  ngAfterViewInit(): void {
    this.width = this.viewport.elementRef.nativeElement.clientWidth;
  }

  ngOnDestroy(): void {
    this.ds.disconnect();
  }
}
