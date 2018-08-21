import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';

import { ApplicationService } from '../../../core/application.service';
import { PlayerService } from '../player.service';
import { ParallaxHeaderComponent } from '../../../shared/parallax-header/parallax-header.component';
import { TableRowAnimation } from '../../../shared/animations/table-row.animation';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';
import { Member } from '../../member/member';
import { Season } from '../../season/season';
import { Player } from '../player';
import { Rating } from '../../rating/rating';

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
    public app: ApplicationService
  ) {

  }

  ngOnInit() {
    // this.season = this.sharedService.currentChampionship.season;
    // const id = parseInt(this.route.snapshot.params['id'], 10);
    this.route.data.subscribe((data: { player: Player }) => {
      this.player = of(data.player);
      this.selectedMember = data.player.members[0];
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
