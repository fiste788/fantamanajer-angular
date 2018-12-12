import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { TeamService } from '@app/core/services';
import { Team } from '@app/core/models';
import { CardCreationAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  teams: Observable<Team[]>;
  scrollTarget: Element;

  constructor(
    private teamService: TeamService,
    private shared: SharedService,
    private route: ActivatedRoute, private scroller: ScrollDispatcher) { }

  ngOnInit(): void {
    this.scrollTarget = this.scroller.scrollContainers.keys().next().value.getElementRef().nativeElement;
    this.teams = this.teamService.getTeams(SharedService.getChampionshipId(this.route));
  }
}
