import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationService } from '../../../core/application.service';
import { TableRowAnimation } from '../../../shared/animations/table-row.animation';
import { EnterDetailAnimation } from '../../../shared/animations/enter-detail.animation';
import { Member } from '../../member/member';
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
export class PlayerComponent {
  player: Observable<Player>;
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
    private route: ActivatedRoute,
    public app: ApplicationService
  ) {
    this.player = this.route.data.pipe(map(({ player }) => {
      this.selectedMember = player.members[0];
      this.seasonChange();
      return player;
    }));
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
