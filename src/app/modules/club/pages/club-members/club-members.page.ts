import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

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
  ) {}

  public ngOnInit(): void {
    this.members$ = UtilService.getData<Club>(this.route, 'club').pipe(
      switchMap((club) => this.memberService.getByClubId(club.id)),
    );
  }
}
