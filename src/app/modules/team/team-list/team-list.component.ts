import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';
import { Observable } from 'rxjs';
import { TeamService } from '../team.service';
import { Team } from '../team';
import { CardCreationAnimation } from '../../../shared/animations/card-creation.animation';
import { ScrollDispatcher } from '@angular/cdk/overlay';

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
    this.teams = this.teamService.getTeams(this.shared.getChampionshipId(this.route));
  }
}
