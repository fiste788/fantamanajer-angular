import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationService } from '@app/services';
import { MemberService } from '@data/services';
import { Member } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

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
})
export class HomePage {
  protected readonly bestPlayers$: Observable<Array<BestPlayer> | undefined>;

  constructor(private readonly memberService: MemberService, public app: ApplicationService) {
    this.bestPlayers$ = this.loadBestPlayers();
  }

  protected loadBestPlayers(): Observable<Array<BestPlayer>> {
    return this.memberService.getBest().pipe(
      map((role) =>
        role
          .filter((a) => a.best_players !== undefined)
          .map((a) => ({
            first: a.best_players?.shift() as Member,
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
