import { AsyncPipe, DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { addVisibleClassOnDestroy, groupBy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Member, Role } from '@data/types';
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
    AsyncPipe,
    SlicePipe,
    RouterLink,
    MatRippleModule,
    DecimalPipe,
  ],
})
export class HomePage {
  readonly #memberService = inject(MemberService);

  protected matchday$ = inject(ApplicationService).matchday$;
  protected roleService = inject(RoleService);
  protected roles = this.roleService.list();
  protected bestPlayers$ = this.loadBestPlayers();

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected async loadBestPlayers(): Promise<Map<Role, Array<Member>>> {
    return firstValueFrom(
      this.matchday$.pipe(
        switchMap((matchday) => this.#memberService.getBest(matchday.id - 1)),
        map((members) => groupBy(members, (member) => this.roleService.get(member.role_id))),
      ),
      { defaultValue: new Map() },
    );
  }
}
