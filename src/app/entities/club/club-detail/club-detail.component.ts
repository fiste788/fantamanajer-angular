import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';
import { Member } from '../../member/member';
import { ClubService } from '../club.service';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { MemberService } from '../../member/member.service';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators/share';
import { of } from 'rxjs/observable/of';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [EnterDetailAnimation]
})
export class ClubDetailComponent implements OnInit, AfterViewChecked {
  club: Observable<Club>;
  members: Observable<Member[]>;
  responsive = true;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private memberService: MemberService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { club: Club }) => {
      this.club = of(data.club);
      this.members = this.memberService.getByClubId(data.club.id).pipe(share());
      // this.members = of(club.members);
    });
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }
}
