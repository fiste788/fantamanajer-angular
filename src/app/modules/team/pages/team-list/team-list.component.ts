import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TeamService } from '@app/http';
import { UtilService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Championship, Team } from '@shared/models';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [cardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  teams$?: Observable<Array<Team>>;
  exit = false;
  scrollTarget: Element;

  constructor(
    private readonly router: Router,
    private readonly teamService: TeamService,
    private readonly route: ActivatedRoute,
    private readonly scroller: ScrollDispatcher) { }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.teams$ = undefined;
      }
    });
    this.scrollTarget = this.scroller.scrollContainers.keys()
      .next().value
      .getElementRef().nativeElement;
    const id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id;
    if (id) {
      this.teams$ = this.teamService.getTeams(id);
    }
  }

  track(_: number, item: Team): number {
    return item.id;
  }
}
