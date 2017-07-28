import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { ObservableMedia } from '@angular/flex-layout';

import { Member } from '../member/member';
import { Season } from '../season/season';
import { SharedService } from '../shared/shared.service';
import { Player } from './player';
import { Rating } from '../rating/rating';
import { PlayerService } from './player.service';
import { ParallaxHeaderComponent } from '../shared/parallax-header/parallax-header.component';

@Component({
  selector: 'fm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player: Player;
  seasons: Season[];
  season: Season;
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
    public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private sharedService: SharedService) {
      this.dataSource = new RatingDataSource(this);
    }

  ngOnInit() {
    this.season = this.sharedService.currentChampionship.season;
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.playerService.getPlayer(id).then(player => {
      this.player = player;

      this.selectedMember = player.members[0];
      this.sharedService.pageTitle = player.name + ' ' + player.surname;
      this.changeRef.detectChanges();
    });
  }

}
export class RatingDataSource extends DataSource<Rating> {
  constructor(private playerComponent: PlayerComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Rating[]> {
    const ratings: Rating[] = this.playerComponent.selectedMember.ratings;
    console.log( ratings);
    return Observable.of(ratings);
  }

  disconnect() {}
}
