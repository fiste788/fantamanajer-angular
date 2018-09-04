import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StreamActivity } from '../../../shared/stream/stream-activity';
import { StreamService } from '../../../shared/stream/stream.service';
import { Club } from '../club';


@Component({
  selector: 'fm-club-stream',
  templateUrl: './club-stream.component.html',
  styleUrls: ['./club-stream.component.scss']
})
export class ClubStreamComponent implements OnInit {

  activities: StreamActivity[] = [];

  constructor(private streamService: StreamService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    this.route.parent.data.subscribe((data: { club: Club }) => {
      this.streamService.getByClub(data.club.id).subscribe(activities => this.activities = activities.results);
    });
  }
}
