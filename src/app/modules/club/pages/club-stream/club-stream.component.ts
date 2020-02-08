import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '@app/core/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fm-club-stream',
  templateUrl: './club-stream.component.html',
  styleUrls: ['./club-stream.component.scss']
})
export class ClubStreamComponent {

  id: number;

  constructor(private readonly route: ActivatedRoute) {
    this.route.parent?.data.pipe(map((data: { club: Club }) => {
      this.id = data.club.id;
    }));
  }
}
