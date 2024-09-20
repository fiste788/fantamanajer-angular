/* eslint-disable @angular-eslint/no-async-lifecycle-method */
import { NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { cardCreationAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { PlayerImageComponent } from '@shared/components/player-image';

import { BestPlayersListComponent } from '../components/best-players-list/best-players-list.component';
import { BestPlayer } from '../types/best-players';

@Component({
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.page.scss',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    PlayerImageComponent,
    BestPlayersListComponent,
    MatEmptyStateComponent,
    MatProgressBarModule,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class HomePage {
  readonly #memberService = inject(MemberService);

  protected matchday$ = inject(ApplicationService).matchday$;
  protected roles = inject(RoleService).list();
  protected bestPlayers$ = this.loadBestPlayers();

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected loadBestPlayers(): Observable<Map<string, BestPlayer>> {
    return this.#memberService.getBest().pipe(
      map(
        (roles) =>
          new Map(
            roles
              .filter((a) => a.best_players !== undefined)
              .map((a) => [
                a.singolar,
                {
                  first: a.best_players!.shift()!,
                  others: a.best_players ?? [],
                },
              ]),
          ),
      ),
    );
  }
}
