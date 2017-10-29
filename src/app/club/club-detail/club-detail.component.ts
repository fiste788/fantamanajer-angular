import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';
import { Member } from '../../member/member';
import { ClubService } from '../club.service';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss']
})
export class ClubDetailComponent implements OnInit, AfterViewChecked {
  club: Observable<Club>;
  members: Observable<Member[]>;
  responsive = true;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.club = this.clubService.getClub(id).share();
    this.club.subscribe(club => (this.members = Observable.of(club.members)));
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }
}
