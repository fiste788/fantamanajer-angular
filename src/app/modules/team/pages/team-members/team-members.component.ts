import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
    const team = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (team) {
      this.members$ = this.memberService.getByTeamId(team.id);
    }
  }
}
