import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, empty } from 'rxjs';
import { Club } from '../club';
import { ClubService } from '../club.service';
import { CardCreationAnimation } from '../../../shared/animations/card-creation.animation';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class ClubListComponent implements OnInit, OnDestroy {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  clubs: Observable<Club[]>;
  subscription: Subscription;
  exit: boolean;

  constructor(private clubService: ClubService, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.clubs = null;
      }
    });
    this.clubs = this.clubService.getClubs();
  }

  track(index, club: Club) {
    return club.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
