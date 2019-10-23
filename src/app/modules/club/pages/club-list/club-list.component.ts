import { Component, OnInit, HostBinding, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable, Subscription } from 'rxjs';
import { Club } from '@app/core/models';
import { ClubService } from '@app/core/services';
import { cardCreationAnimation } from '@app/core/animations/card-creation.animation';
import { trigger, transition, query, animate, style } from '@angular/animations';

@Component({
  selector: 'fm-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [cardCreationAnimation,
    /*trigger('open', [
      transition('* <=> *', [
        query('img',
          animate('3500ms cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ position: 'absolute', top: 0, width: '100%' })),
        )
      ])
    ])*/
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubListComponent implements OnInit, OnDestroy {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  clubs: Observable<Club[]>;
  subscription: Subscription;
  exit = false;
  id: number;
  scrollTarget: Element;

  constructor(private clubService: ClubService, private router: Router, private scroller: ScrollDispatcher, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.subscription = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        //this.id = parseInt(evt.url.split('/').pop(), 10);
        this.exit = true;
        this.clubs = null;
      }
    });
    this.clubs = this.clubService.getClubs();
    this.scrollTarget = this.scroller.scrollContainers.keys().next().value.getElementRef().nativeElement;
  }

  track(_: number, club: Club) {
    return club.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
