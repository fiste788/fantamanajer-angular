import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { ObservableMedia } from '@angular/flex-layout';

import { Member } from '../../member/member';
import { Season } from '../../season/season';
import { SharedService } from '../../shared/shared.service';
import { Player } from '../player';
import { Rating } from '../../rating/rating';
import { PlayerService } from '../player.service';
import { ParallaxHeaderComponent } from '../../shared/parallax-header/parallax-header.component';
import { TableRowAnimation } from '../../shared/animations/table-row.animation';
import { EnterDetailAnimation } from '../../shared/animations/enter-detail.animation';
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

  dataSource: RatingDataSource | null;
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
      this.dataSource = new RatingDataSource(this);
      this.selectedMember = player.members[0];
      this.sharedService.pageTitle = player.name + ' ' + player.surname;
      this.changeRef.detectChanges();
    });
  }

  seasonChange() {
    console.log(this.selectedMember);
    this.dataSource = new RatingDataSource(null);
    this.changeRef.detectChanges();
    // this.dataSource = new RatingDataSource(this);
    this.changeRef.detectChanges();
  }

  buy() {
    localStorage.setItem('buyingMember', JSON.stringify(this.selectedMember));
    return false;
  }
}
export class RatingDataSource extends DataSource<Rating> {
  constructor(private playerComponent: PlayerComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Rating[]> {
    let ratings: Rating[] = [];
    if (this.playerComponent != null) {
      ratings = this.playerComponent.selectedMember.ratings;
    }

    return of(ratings);
  }

  disconnect() { }
}
