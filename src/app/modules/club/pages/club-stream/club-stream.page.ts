import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Club } from '@data/types';

@Component({
  styleUrls: ['./club-stream.page.scss'],
  templateUrl: './club-stream.page.html',
})
export class ClubStreamPage {
  public id: number;

  constructor(private readonly route: ActivatedRoute) {
    this.id = UtilService.getSnapshotData<Club>(this.route, 'club')?.id ?? 0;
  }
}
