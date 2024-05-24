/* eslint-disable @angular-eslint/no-async-lifecycle-method */
import { NgIf, NgFor, AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Role } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { MatEmptyStateComponent, PlayerImageComponent } from '@shared/components';

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
  ],
})
export class HomePage implements OnInit {
  protected matchday$ = inject(ApplicationService).matchday$;
  protected roles: Array<{ role: Role; best_players?: BestPlayer }>;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: string,
    private readonly memberService: MemberService,
    private readonly roleService: RoleService,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.roles = this.roleService.list().map((r) => ({ role: r }));
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  public ngOnInit(): void {
    this.loadBestPlayers();
  }

  protected loadBestPlayers(): Subscription {
    return this.memberService
      .getBest()
      .pipe(
        map((roles) =>
          roles
            .filter((a) => a.best_players !== undefined)
            .map((a) => ({
              first: a.best_players!.shift()!,
              others: a.best_players ?? [],
              role: a.singolar,
            })),
        ),
        tap((bps) => {
          for (const bp of bps) {
            this.roles.find((r) => r.role.singolar === bp.role)!.best_players = bp;
          }
          if (isPlatformBrowser(this.platformId)) {
            this.cd.detectChanges();
          }
        }),
      )
      .subscribe();
  }
}
