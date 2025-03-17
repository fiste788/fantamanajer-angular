import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

import { addVisibleClassOnDestroy, groupBy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { cardCreationAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { PlayerImageComponent } from '@shared/components/player-image';

import { BestPlayersListComponent } from '../components/best-players-list/best-players-list.component';

@Component({
  animations: [cardCreationAnimation],
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
  ],
})
export class HomePage {
  readonly #memberService = inject(MemberService);

  protected matchday = inject(ApplicationService).matchday;
  protected readonly getBestResource = this.#memberService.getBestResource(this.matchday);
  protected roleService = inject(RoleService);
  protected roles = this.roleService.list();
  protected bestPlayers = computed(() =>
    groupBy(this.getBestResource.value(), (member) => this.roleService.get(member.role_id)),
  );

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }
}
