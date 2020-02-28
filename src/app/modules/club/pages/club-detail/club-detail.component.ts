import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { enterDetailAnimation, tabTransition } from '@shared/animations';
import { Club } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [enterDetailAnimation, tabTransition]
})
export class ClubDetailComponent implements OnInit {
  club: Observable<Club>;
  tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.club = this.route.data.pipe(map((data: { club: Club }) => data.club));
  }

  getState(outlet: RouterOutlet): string {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }
}
