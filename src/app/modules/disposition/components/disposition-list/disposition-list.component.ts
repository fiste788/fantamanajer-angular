import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Disposition } from '../disposition';
import { Lineup } from '../../lineup/lineup';
import { Router, RouterModule } from '@angular/router';
import { TableRowAnimation } from '../../../shared/animations/table-row.animation';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss'],
  animations: [TableRowAnimation]
})
export class DispositionListComponent implements OnInit {
  @Input() public lineup?: Lineup;
  @Input() public dispositions: Disposition[];
  @Input() public caption: string;
  @Input() public regular = false;
  public captains: Map<number, string>;

  dataSource: MatTableDataSource<Disposition>;
  displayedColumns = [
    'player',
    'role',
    'club',
    'regular',
    'yellowCard',
    'redCard',
    'assist',
    'goals',
    'points'
  ];

  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.lineup) {
      this.captains = new Map();
      this.captains.set(this.lineup.captain_id, 'C');
      this.captains.set(this.lineup.vcaptain_id, 'VC');
      this.captains.set(this.lineup.vvcaptain_id, 'VVC');
    }
    this.dataSource = new MatTableDataSource(this.dispositions);
  }
}

