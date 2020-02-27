import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { cardCreationAnimation } from '@app/core/animations';
import { TeamService } from '@app/core/http';
import { Team } from '@app/shared/models';
import { SharedService } from '@app/shared/services/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [cardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  teams?: Observable<Array<Team>>;
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
        this.teams = undefined;
      }
    });
    this.scrollTarget = this.scroller.scrollContainers.keys()
      .next().value
      .getElementRef().nativeElement;
    const id = SharedService.getChampionshipId(this.route);
    if (id) {
      this.teams = this.teamService.getTeams(id);
    }
  }

  track(_: number, item: Team): number {
    return item.id;
  }
}
