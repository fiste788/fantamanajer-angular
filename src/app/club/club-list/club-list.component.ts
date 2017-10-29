import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Club } from '../club';
import { ClubService } from '../club.service';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss']
})
export class ClubListComponent implements OnInit {
  clubs: Observable<Club[]>;

  constructor(private clubService: ClubService) {}

  ngOnInit(): void {
    this.clubs = this.clubService.getClubs();
  }
}
