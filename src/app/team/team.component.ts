import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'fm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  constructor(private sharedService: SharedService,
    private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    return;
  }


}
