import { Component, OnInit, Input } from '@angular/core';
import { StreamActivity } from './stream-activity';
import { ListItemAnimation } from '../animations/list-item.animation';

@Component({
  selector: 'fm-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  animations: [ListItemAnimation]
})
export class StreamComponent implements OnInit {
  @Input() activities: StreamActivity[] = null;
  public isLoading = false;

  constructor(
  ) { }

  ngOnInit() {
  }


}
