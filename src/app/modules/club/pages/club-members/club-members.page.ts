import { Component, computed, inject } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import { MemberService } from '@data/services';
import { Club } from '@data/types';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  templateUrl: './club-members.page.html',
  imports: [MemberListComponent],
})
export class ClubMembersPage {
  readonly #clubService = inject(MemberService);
  protected club = getRouteDataSignal<Club>('club');
  protected clubId = computed(() => this.club().id);

  protected readonly members = this.#clubService.getByClubIdResource(this.clubId);
}
