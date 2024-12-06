import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Club } from '@data/types';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  templateUrl: './club-members.page.html',
  imports: [MemberListComponent, AsyncPipe],
})
export class ClubMembersPage {
  readonly #clubService = inject(MemberService);

  protected readonly members$ = getRouteData<Club>('club').pipe(
    switchMap((club) => this.#clubService.getByClubId(club.id)),
  );
}
