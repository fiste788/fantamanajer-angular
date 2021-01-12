import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Championship } from '@data/types';

@Component({
  selector: 'app-championship-stream',
  styleUrls: ['./championship-stream.page.scss'],
  templateUrl: './championship-stream.page.html',
})
export class ChampionshipStreamPage implements OnInit {
  public id: number;

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id ?? 0;
  }
}
