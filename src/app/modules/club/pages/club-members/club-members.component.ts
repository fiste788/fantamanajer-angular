import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tableRowAnimation } from '@app/core/animations';
import { Club, Member } from '@app/core/models';
import { MemberService } from '@app/core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  animations: [tableRowAnimation]
})
export class ClubMembersComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  members?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe((data: { club: Club }) => {
      this.members = undefined;
      try {
        this.changeRef.detectChanges();
        // tslint:disable-next-line: no-empty
      } catch (e) { }
      this.members = this.memberService.getByClubId(data.club.id);
    });
  }
}
