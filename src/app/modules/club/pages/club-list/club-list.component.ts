import { ScrollDispatcher } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ClubService } from '@app/http';
import { cardCreationAnimation } from '@shared/animations/card-creation.animation';
import { Club } from '@shared/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubListComponent implements OnInit, OnDestroy {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  clubs?: Observable<Array<Club>>;
  subscription: Subscription;
  exit = false;
  id: number;

  constructor(private readonly clubService: ClubService, private readonly router: Router, private readonly scroller: ScrollDispatcher) {
  }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.clubs = undefined;
      }
    });
    this.clubs = this.clubService.getClubs();
  }

  track(_: number, club: Club): number {
    return club.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
