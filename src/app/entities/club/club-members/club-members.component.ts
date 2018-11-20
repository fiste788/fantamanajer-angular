import { Component, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { MemberService } from '../../member/member.service';
import { Member } from '../../member/member';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  animations: [TableRowAnimation]
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
