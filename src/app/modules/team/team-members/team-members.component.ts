import { Team } from '../team';
import { Component, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../../member/member';
import { MemberService } from '../../member/member.service';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss'],
  // animations: [TableRowAnimation]
})
export class TeamMembersComponent implements OnInit {
  // @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  members: Observable<Member[]>;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe((data: { team: Team }) => {
      this.members = null;
      try {
        this.changeRef.detectChanges();
      } catch (e) { }
      this.members = this.memberService.getByTeamId(data.team.id);
    });
  }
}
