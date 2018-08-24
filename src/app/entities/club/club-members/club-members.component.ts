import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MemberService } from '../../member/member.service';
import { Member } from '../../member/member';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';

@Component({
  selector: 'fm-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss']
})
export class ClubMembersComponent implements OnInit {
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
