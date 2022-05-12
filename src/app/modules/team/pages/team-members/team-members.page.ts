import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { MemberService } from '@data/services';
import { Member, Team } from '@data/types';

@Component({
  styleUrls: ['./team-members.page.scss'],
  templateUrl: './team-members.page.html',
})
export class TeamMembersPage implements OnInit {
  public members$?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.members$ = getRouteData<Team>(this.route, 'team').pipe(
      switchMap((team) => this.memberService.getByTeamId(team.id)),
    );
  }
}
