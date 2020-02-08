import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-team-stream',
  templateUrl: './team-stream.component.html',
  styleUrls: ['./team-stream.component.scss']
})
export class TeamStreamComponent implements OnInit {

  id?: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = SharedService.getTeamId(this.route);
  }

}
