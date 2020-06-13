import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Championship } from '@shared/models';

@Component({
  selector: 'fm-championship-stream',
  templateUrl: './championship-stream.page.html',
  styleUrls: ['./championship-stream.page.scss']
})
export class ChampionshipStreamPage implements OnInit {
  id: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id ?? 0;
  }
}
