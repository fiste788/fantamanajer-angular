import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService } from '@data/services';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Club, Member } from '@data/types';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./club-members.page.scss'],
  templateUrl: './club-members.page.html',
})
export class ClubMembersPage implements OnInit {
  public members$?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    const club = UtilService.getSnapshotData<Club>(this.route, 'club');
    if (club) {
      this.members$ = this.memberService.getByClubId(club.id);
    }
  }
}
