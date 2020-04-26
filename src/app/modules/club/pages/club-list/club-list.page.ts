import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ClubService } from '@app/http';
import { cardCreationAnimation } from '@shared/animations/card-creation.animation';
import { Club } from '@shared/models';

@Component({
  templateUrl: './club-list.page.html',
  styleUrls: ['./club-list.page.scss'],
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubListPage implements OnInit, OnDestroy {
  clubs$?: Observable<Array<Club>>;
  subscription: Subscription;
  exit = false;
  id: number;

  constructor(
    private readonly clubService: ClubService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.clubs$ = this.clubService.getClubs();
    this.subscription = this.exitSubscription();
  }

  exitSubscription(): Subscription {
    return this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.clubs$ = undefined;
      }
    });
  }

  track(_: number, club: Club): number {
    return club.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
