import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MemberService } from '@data/services';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Member } from '@data/types';

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
export class HomePage implements OnInit {
  public bestPlayers$: Observable<Array<BestPlayer> | undefined>;

  constructor(private readonly memberService: MemberService, public app: ApplicationService) {}

  public ngOnInit(): void {
    this.bestPlayers$ = this.memberService.getBest().pipe(
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

  public track(_: number, item: Member): number {
    return item.id; // or item.id
  }

  public trackByRole(_: number, item: BestPlayer): string {
    return item.role; // or item.id
  }
}
