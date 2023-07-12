import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService } from '@data/services';
import { Member } from '@data/types';
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
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class HomePage {
  protected readonly bestPlayers$: Observable<Array<BestPlayer> | undefined>;

  constructor(
    private readonly memberService: MemberService,
    public app: ApplicationService,
  ) {
    this.bestPlayers$ = this.loadBestPlayers();
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected loadBestPlayers(): Observable<Array<BestPlayer>> {
    return this.memberService.getBest().pipe(
      map((role) =>
        role
          .filter((a) => a.best_players !== undefined)
          .map((a) => ({
            first: a.best_players!.shift()!,
            others: a.best_players ?? [],
            role: a.singolar,
          })),
      ),
    );
  }

  protected track(_: number, item: Member): number {
    return item.id; // or item.id
  }

  protected trackByRole(_: number, item: BestPlayer): string {
    return item.role; // or item.id
  }
}
