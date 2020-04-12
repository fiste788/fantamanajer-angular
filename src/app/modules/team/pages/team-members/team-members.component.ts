import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MemberService } from '@app/http';
import { UtilService } from '@app/services';
import { Member, Team } from '@shared/models';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  members$?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.members$ = UtilService.getData<Team>(this.route, 'team')
      ?.pipe(switchMap(team => this.memberService.getByTeamId(team.id)));
  }
}
