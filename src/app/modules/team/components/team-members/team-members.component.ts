import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, Member } from '@app/core/models';
import { MemberService } from '@app/core/services';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss'],
})
export class TeamMembersComponent implements OnInit {
  members?: Observable<Member[]>;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.parent?.data.subscribe((data: { team: Team }) => {
      this.members = undefined;
      try {
        this.changeRef.detectChanges();
      } catch (e) { }
      this.members = this.memberService.getByTeamId(data.team.id);
    });
  }
}
