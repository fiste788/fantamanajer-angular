import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationService } from '@app/core/services';
import { enterDetailAnimation, tableRowAnimation } from '@app/shared/animations';
import { Member, Player, Rating } from '@app/shared/models';

@Component({
  selector: 'fm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    tableRowAnimation,
    enterDetailAnimation
  ]
})
export class PlayerComponent {
  player: Observable<Player>;
  selectedMember: Member;
  @ViewChild(MatSort) sort: MatSort;

  dataSource?: MatTableDataSource<Rating>;
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
    private readonly changeRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    public app: ApplicationService
  ) {
    this.player = this.route.data.pipe(map(({ player }) => {
      this.selectedMember = player.members[0];
      this.seasonChange();

      return player;
    }));
  }

  seasonChange(): void {
    if (this.dataSource !== undefined) {
      this.dataSource = undefined;
      this.changeRef.detectChanges();
    }
    this.dataSource = new MatTableDataSource<Rating>(this.selectedMember.ratings);
    this.changeRef.detectChanges();
    this.dataSource.sort = this.sort;
  }

  buy(): boolean {
    localStorage.setItem('buyingMember', JSON.stringify(this.selectedMember));

    return false;
  }

  track(_: number, item: Member): number {
    return item.id;
  }
}
