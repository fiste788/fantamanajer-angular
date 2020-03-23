import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService } from '@app/http';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Club, Member } from '@shared/models';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  animations: [tableRowAnimation]
})
export class ClubMembersComponent implements OnInit {
  members$?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const club = UtilService.getSnapshotData<Club>(this.route, 'club');
    if (club) {
      this.members$ = this.memberService.getByClubId(club.id);
    }
  }
}
