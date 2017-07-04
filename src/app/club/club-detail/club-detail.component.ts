import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';
import { ClubService } from '../club.service';
import { MemberListComponent } from '../../member/member-list/member-list.component';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss']
})
export class ClubDetailComponent implements OnInit, AfterViewChecked {

  club: Club;
  responsive = true;

  constructor(private route: ActivatedRoute,
    private clubService: ClubService,
    private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.clubService.getClub(id).then(club => this.club = club);
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

}
