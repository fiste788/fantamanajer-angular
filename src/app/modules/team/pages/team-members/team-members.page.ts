import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Team } from '@data/types';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';

@Component({
  templateUrl: './team-members.page.html',
  imports: [MemberListComponent],
})
export class TeamMembersPage {
  readonly #memberService = inject(MemberService);

  protected readonly members$ = getRouteData<Team>('team').pipe(
    switchMap((team) => this.#memberService.getByTeamId(team.id)),
  );
}
