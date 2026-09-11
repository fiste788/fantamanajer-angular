import { Component, computed, inject } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import type { Club } from '@data/interfaces';
import { MemberService } from '@data/services';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  imports: [MemberListComponent],
  templateUrl: './club-members.page.html',
})
export class ClubMembersPage {

  readonly #clubService = inject(MemberService);

  protected club = getRouteDataSignal<Club>('club');

  protected readonly clubId = computed(() => this.club().id);
  protected readonly members = this.#clubService.getMembersByClubIdResource(this.clubId);

}
