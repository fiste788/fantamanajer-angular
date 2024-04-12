import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Member, Team } from '@data/types';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';

@Component({
  styleUrl: './team-members.page.scss',
  templateUrl: './team-members.page.html',
  standalone: true,
  imports: [NgIf, MemberListComponent],
})
export class TeamMembersPage {
  protected readonly members$: Observable<Array<Member>>;

  constructor(private readonly memberService: MemberService) {
    this.members$ = getRouteData<Team>('team').pipe(
      switchMap((team) => this.memberService.getByTeamId(team.id)),
    );
  }
}
