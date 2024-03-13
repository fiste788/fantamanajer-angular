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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Member, Role } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { MatEmptyStateComponent, PlayerImageComponent } from '@shared/components';

interface BestPlayer {
  role: string;
  first: Member;
  others: Array<Member>;
}
@Component({
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    PlayerImageComponent,
    MatExpansionModule,
    MatListModule,
    RouterLink,
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
