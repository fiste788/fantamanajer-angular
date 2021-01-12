import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ClubService } from '@data/services';
import { cardCreationAnimation } from '@shared/animations';
import { Club } from '@data/types';

@Component({
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./club-list.page.scss'],
  templateUrl: './club-list.page.html',
})
export class ClubListPage implements OnInit, OnDestroy {
  public clubs$?: Observable<Array<Club>>;
  public subscription: Subscription;
  public exit = false;
  public id: number;

  constructor(private readonly clubService: ClubService, private readonly router: Router) {}

  public ngOnInit(): void {
    this.clubs$ = this.clubService.getClubs();
    this.subscription = this.exitSubscription();
  }

  public exitSubscription(): Subscription {
    return this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.clubs$ = undefined;
      }
    });
  }

  public track(_: number, club: Club): number {
    return club.id;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
