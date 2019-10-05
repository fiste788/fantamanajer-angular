import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { TeamService } from '@app/core/services';
import { Team } from '@app/core/models';
import { cardCreationAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [cardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  teams: Observable<Team[]>;
  exit = false;
  scrollTarget: Element;

  constructor(
    private router: Router,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private scroller: ScrollDispatcher) { }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.teams = null;
      }
    });
    this.scrollTarget = this.scroller.scrollContainers.keys().next().value.getElementRef().nativeElement;
    this.teams = this.teamService.getTeams(SharedService.getChampionshipId(this.route));
  }
}
