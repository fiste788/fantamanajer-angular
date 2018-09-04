import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { ClubService } from '../club.service';
import { MemberService } from '../../member/member.service';
import { Club } from '../club';
import { Member } from '../../member/member';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [EnterDetailAnimation]
})
export class ClubDetailComponent implements OnInit, AfterViewChecked {
  club: Observable<Club>;
  members: Observable<Member[]>;
  responsive = true;
  tabs: { label: string; link: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { club: Club }) => {
      this.club = of(data.club);
      this.members = this.memberService.getByClubId(data.club.id).pipe(share());
      this.tabs = [];
      this.tabs.push({ label: 'Giocatori', link: 'players' });
      this.tabs.push({ label: 'Attività', link: 'stream' });
    });
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }
}
