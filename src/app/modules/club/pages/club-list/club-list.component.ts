import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ClubService } from '@app/http';
import { cardCreationAnimation } from '@shared/animations/card-creation.animation';
import { Club } from '@shared/models';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubListComponent implements OnInit, OnDestroy {
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
    this.subscription = this.exitSubscription();
    this.clubs$ = this.clubService.getClubs();
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
