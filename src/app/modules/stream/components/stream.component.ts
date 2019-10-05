import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { listItemAnimation } from '@app/core/animations/list-item.animation';
import { StreamService } from '@app/core/services/stream.service';
import { StreamDataSource } from './stream.datasource';

@Component({
  selector: 'fm-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  animations: [listItemAnimation]
})
export class StreamComponent implements OnInit, OnDestroy {
  public ds: StreamDataSource;
  public width: number;
  @Input() context: 'teams' | 'users' | 'clubs' | 'championships';
  @Input() id: number;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;

  constructor(private streamService: StreamService) { }

  ngOnInit() {
    this.width = this.viewport.elementRef.nativeElement.clientWidth;
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  ngOnDestroy() {
    this.ds.disconnect();
  }


}
