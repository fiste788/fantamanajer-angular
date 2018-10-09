import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';


@Component({
  selector: 'fm-club-stream',
  templateUrl: './club-stream.component.html',
  styleUrls: ['./club-stream.component.scss']
})
export class ClubStreamComponent implements OnInit {

  id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.data.subscribe((data: { club: Club }) => {
      this.id = data.club.id;
    });
  }
}
