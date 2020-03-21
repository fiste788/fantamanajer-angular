import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService } from '@app/http';
import { tableRowAnimation } from '@shared/animations';
import { Club, Member } from '@shared/models';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  animations: [tableRowAnimation]
})
export class ClubMembersComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';

  members$?: Observable<Array<Member>>;

  constructor(
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe((data: { club: Club }) => {
      this.members$ = undefined;
      try {
        this.changeRef.detectChanges();
        // tslint:disable-next-line: no-empty
      } catch (e) { }
      this.members$ = this.memberService.getByClubId(data.club.id);
    });
  }
}
