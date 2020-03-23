import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Club } from '@shared/models';

@Component({
  selector: 'fm-club-stream',
  templateUrl: './club-stream.component.html',
  styleUrls: ['./club-stream.component.scss']
})
export class ClubStreamComponent {
  id: number;

  constructor(private readonly route: ActivatedRoute) {
    const club = UtilService.getSnapshotData<Club>(this.route, 'club');
    if (club) {
      this.id = club.id;
    }
  }
}
