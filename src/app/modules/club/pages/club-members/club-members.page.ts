import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Club, Member } from '@data/types';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';

@Component({
  templateUrl: './club-members.page.html',
  standalone: true,
  imports: [NgIf, MemberListComponent],
})
export class ClubMembersPage {
  protected readonly members$: Observable<Array<Member>>;

  constructor(private readonly memberService: MemberService) {
    this.members$ = getRouteData<Club>('club').pipe(
      switchMap((club) => this.memberService.getByClubId(club.id)),
    );
  }
}
