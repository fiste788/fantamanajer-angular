import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MemberService } from '@app/http';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Member } from '@shared/models';

interface BestPlayer {
  role: string;
  first: Member;
  others: Array<Member>;
}
@Component({
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [cardCreationAnimation]
})
export class HomePage implements OnInit {

  bestPlayers$: Observable<Array<BestPlayer> | undefined>;

  constructor(
    private readonly memberService: MemberService,
    public app: ApplicationService
  ) { }

  ngOnInit(): void {
    this.bestPlayers$ = this.memberService.getBest()
      .pipe(map(role =>
        role.filter(a => a.best_players !== undefined)
          .map(a =>
            ({
              role: a.singolar,
              first: a.best_players?.shift() as Member,
              others: a.best_players ?? []
            })
          )
      ));
  }

  track(_: number, item: Member): number {
    return item.id; // or item.id
  }

  trackByRole(_: number, item: BestPlayer): string {
    return item.role; // or item.id
  }
}
