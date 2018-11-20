import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, OutletContext, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Club } from '../club';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';
import { tabTransition } from 'app/shared/animations/tab-transition.animation';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [EnterDetailAnimation, tabTransition]
})
export class ClubDetailComponent implements OnInit {
  club: Observable<Club>;
  tabs: { label: string; link: string }[] = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.club = this.route.data.pipe(map((data: { club: Club }) => data.club));
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }
}
