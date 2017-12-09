import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../club';
import { Member } from '../../member/member';
import { ClubService } from '../club.service';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { Observable } from 'rxjs/Observable';
import { trigger, style, transition, animate, query } from '@angular/animations';
import { share } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [
    trigger('enterDetailAnimation', [
      transition('* => *', [
        query('.animation-container', style({ opacity: 0, transform: 'translatey(20px)' })),

        query('.animation-container',
          animate('250ms 1ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ),

        query('.animation-container', [
          animate(1000, style('*'))
        ])
      ])
    ])
  ]
})
export class ClubDetailComponent implements OnInit, AfterViewChecked {
  club: Observable<Club>;
  members: Observable<Member[]>;
  responsive = true;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.club = this.clubService.getClub(id).pipe(share());
    this.club.subscribe(club => (this.members = of(club.members)));
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }
}
