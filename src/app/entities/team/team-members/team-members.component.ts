import { Team } from '../team';
import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { Observable } from 'rxjs';
import { Member } from '../../member/member';
import { MemberService } from '../../member/member.service';
import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  members: Observable<Member[]>;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.members = this.memberService.getByTeamId(this.sharedService.getTeamId(this.route));
  }
}
