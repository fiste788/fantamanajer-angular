import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import type { Team } from '@data/interfaces';
import { MemberService } from '@data/services';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  imports: [AsyncPipe, MemberListComponent],
  templateUrl: './team-members.page.html',
})
export class TeamMembersPage {

  readonly #memberService = inject(MemberService);

  protected readonly members$ = getRouteData<Team>('team').pipe(switchMap(team => this.#memberService.getMembersByTeamId(team.id)));

}
