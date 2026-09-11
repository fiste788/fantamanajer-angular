import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

import { groupBy } from '@app/functions';
import { AppService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { PlayerImageComponent } from '@shared/components/player-image';
import { DetailToListTransitionDirective } from '@shared/directives';
import { SlugPipe } from '@shared/pipes';

import { BestPlayersListComponent } from '../components/best-players-list/best-players-list.component';

@Component({
  imports: [
    BestPlayersListComponent,
    DecimalPipe,
    DetailToListTransitionDirective,
    MatCardModule,
    MatEmptyStateComponent,
    MatProgressBarModule,
    MatRippleModule,
    PlayerImageComponent,
    RouterLink,
    SlicePipe,
    SlugPipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {

  readonly #memberService = inject(MemberService);
  protected matchday = inject(AppService).currentMatchday;
  protected roleService = inject(RoleService);

  protected roles = this.roleService.list();

  protected readonly bestResource = this.#memberService.getBestMembersResource(this.matchday);
  protected readonly bestPlayers = computed(() => groupBy(this.bestResource.value(), member => this.roleService.getRoleById(member.role_id)));

}
