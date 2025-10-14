import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

import { groupBy } from '@app/functions';
import { ApplicationService, CurrentTransitionService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Member } from '@data/types';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { PlayerImageComponent } from '@shared/components/player-image';
import { SlugPipe } from '@shared/pipes';

import { BestPlayersListComponent } from '../components/best-players-list/best-players-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.page.scss',
  templateUrl: './home.page.html',
  imports: [
    MatCardModule,
    PlayerImageComponent,
    BestPlayersListComponent,
    MatEmptyStateComponent,
    MatProgressBarModule,
    SlicePipe,
    RouterLink,
    MatRippleModule,
    DecimalPipe,
    SlugPipe,
  ],
})
export class HomePage {
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #memberService = inject(MemberService);

  protected matchday = inject(ApplicationService).currentMatchday;
  protected readonly getBestResource = this.#memberService.getBestMembersResource(this.matchday);
  protected roleService = inject(RoleService);
  protected roles = this.roleService.list();
  protected bestPlayers = computed(() =>
    groupBy(this.getBestResource.value(), (member) => this.roleService.getRoleById(member.role_id)),
  );

  protected viewTransitionName(member?: Member, transition_name = 'banner-img'): string {
    return member && this.#transitionService.isDetailToList(member.player) ? transition_name : '';
  }
}
