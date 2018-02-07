import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ObservableMedia } from '@angular/flex-layout';

import { Member } from '../../member/member';
import { Season } from '../../season/season';
import { SharedService } from 'app/shared/shared.service';
import { Player } from '../player';
import { Rating } from '../../rating/rating';
import { PlayerService } from '../player.service';
import { ParallaxHeaderComponent } from 'app/shared/parallax-header/parallax-header.component';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';
import { EnterDetailAnimation } from 'app/shared/animations/enter-detail.animation';
import { of } from 'rxjs/observable/of';
import { share } from 'rxjs/operators';

@Component({
  selector: 'fm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    TableRowAnimation,
    EnterDetailAnimation
  ]
})
export class PlayerComponent implements OnInit {
  player: Observable<Player>;
  seasons: Season[];
  // season: Season;
  selectedMember: Member;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Rating>;
  displayedColumns = [
    'matchday',
    'rating',
    'points',
    'goals',
    'goals_against',
    'assist',
    'penalities_scored',
    'penalities_taken',
    'regular',
    'yellow_card',
    'red_card',
    'quotation'
  ];

  constructor(
    public media: ObservableMedia,
    private changeRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    public sharedService: SharedService
  ) {

  }

  ngOnInit() {
    // this.season = this.sharedService.currentChampionship.season;
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.player = this.playerService.getPlayer(id).pipe(share());
    this.player.subscribe(player => {
      this.sharedService.pageTitle = player.name + ' ' + player.surname;
      this.selectedMember = player.members[0];
      this.seasonChange();
    });
  }

  seasonChange() {
    if (this.dataSource != null) {
      this.dataSource = null;
      this.changeRef.detectChanges();
    }
    this.dataSource = new MatTableDataSource<Rating>(this.selectedMember.ratings);
    this.changeRef.detectChanges();
    this.dataSource.sort = this.sort;
  }

  buy() {
    localStorage.setItem('buyingMember', JSON.stringify(this.selectedMember));
    return false;
  }
}
