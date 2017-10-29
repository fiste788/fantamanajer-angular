import { Team } from '../team';
import { Component, OnInit, Injector } from '@angular/core';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { TeamDetailComponent } from '../team-detail/team-detail.component';
import { Observable } from 'rxjs/Observable';
import { Member } from '../../member/member';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  members: Observable<Member[]>;

  constructor(private inj: Injector) {}

  ngOnInit() {
    this.members = this.inj.get(TeamDetailComponent).members;
  }
}
