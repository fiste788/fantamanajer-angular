import { Component, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberService } from '@app/core/services';
import { Member, Club } from '@app/core/models';
import { tableRowAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  animations: [tableRowAnimation]
})
export class ClubMembersComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  members: Observable<Member[]>;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe((data: { club: Club }) => {
      this.members = null;
      try {
        this.changeRef.detectChanges();
      } catch (e) { }
      this.members = this.memberService.getByClubId(data.club.id);
    });
  }
}
