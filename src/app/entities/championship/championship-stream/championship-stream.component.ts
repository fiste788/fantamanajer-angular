import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { StreamActivity } from '../../../shared/stream/stream-activity';
import { StreamService } from '../../../shared/stream/stream.service';

@Component({
  selector: 'fm-championship-stream',
  templateUrl: './championship-stream.component.html',
  styleUrls: ['./championship-stream.component.scss']
})
export class ChampionshipStreamComponent implements OnInit {

  id: number;

  constructor(private shared: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.shared.getChampionshipId(this.route);
  }
}
