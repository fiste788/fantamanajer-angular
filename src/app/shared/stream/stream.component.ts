import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { StreamActivity } from './stream-activity';
import { ListItemAnimation } from '../animations/list-item.animation';
import { StreamDataSource } from './stream.datasource';
import { StreamService } from './stream.service';
import { Observable } from 'rxjs';
import { Stream } from 'stream';
import { CdkVirtualScrollViewport } from '@angular/cdk-experimental/scrolling';

@Component({
  selector: 'fm-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  animations: [ListItemAnimation]
})
export class StreamComponent implements OnInit, OnDestroy {
  public ds: StreamDataSource;
  public width: number;
  @Input() context: 'teams' | 'users';
  @Input() id: number;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(private streamService: StreamService) { }

  ngOnInit() {
    this.width = this.viewport.elementRef.nativeElement.clientWidth;
    this.ds = new StreamDataSource(this.streamService, this.context, this.id);
  }

  ngOnDestroy() {
    this.ds.disconnect();
  }


}
