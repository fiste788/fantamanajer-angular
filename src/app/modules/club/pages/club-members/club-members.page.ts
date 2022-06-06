import { Component } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Club, Member } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./club-members.page.scss'],
  templateUrl: './club-members.page.html',
})
export class ClubMembersPage {
  public members$: Observable<Array<Member>>;

  constructor(private readonly memberService: MemberService) {
    this.members$ = getRouteData<Club>('club').pipe(
      switchMap((club) => this.memberService.getByClubId(club.id)),
    );
  }
}
