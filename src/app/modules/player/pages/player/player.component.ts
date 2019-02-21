import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver } from '@angular/flex-layout';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationService } from '@app/core/services';
import { TableRowAnimation, EnterDetailAnimation } from '@app/core/animations';
import { Member, Player, Rating } from '@app/core/models';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';

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

  public chart: GoogleChartInterface = {
    chartType: 'Line',
    options: {
      height: 320,
      backgroundColor: 'transparent',
      animation: { startup: true },
      vAxis: { minValue: 0 },
      chart: { title: 'Statistiche' }
    }
  };

  constructor(
    public media: MediaObserver,
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
    this.drawGraph();
    this.changeRef.detectChanges();
    this.dataSource.sort = this.sort;
  }

  drawGraph() {
    const dataTable = [];
    dataTable.push(['Matchdays', 'Rating', 'Points']);
    this.selectedMember.ratings.filter(rating => rating.valued).forEach(rating => {
      dataTable.push([rating.matchday.number, rating.rating, rating.points]);
    });
    this.chart.dataTable = dataTable;
    const ccComponent = this.chart.component;
    // force a redraw
    if (ccComponent) {
      ccComponent.draw();
    }
  }

  buy() {
    localStorage.setItem('buyingMember', JSON.stringify(this.selectedMember));
    return false;
  }
}
