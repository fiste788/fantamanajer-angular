import { Component, OnInit, HostBinding, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable, Subscription } from 'rxjs';
import { Club } from '@app/core/models';
import { ClubService } from '@app/core/services';
import { cardCreationAnimation } from '@app/core/animations/card-creation.animation';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubListComponent implements OnInit, OnDestroy {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  clubs?: Observable<Club[]>;
  subscription: Subscription;
  exit = false;
  id: number;

  constructor(private clubService: ClubService, private router: Router, private scroller: ScrollDispatcher) {
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

  track(_: number, club: Club) {
    return club.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
