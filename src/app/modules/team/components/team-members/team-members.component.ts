import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member, Team } from '@app/core/models';
import { MemberService } from '@app/core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  members?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe((data: { team: Team }) => {
      this.members = undefined;
      try {
        this.changeRef.detectChanges();
        // tslint:disable-next-line: no-empty
      } catch (e) { }
      this.members = this.memberService.getByTeamId(data.team.id);
    });
  }
}
