import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { tableRowAnimation } from '@app/core/animations';
import { Disposition, Lineup } from '@app/core/models';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss'],
  animations: [tableRowAnimation]
})
export class DispositionListComponent implements OnInit {
  @Input() lineup?: Lineup;
  @Input() dispositions: Array<Disposition>;
  @Input() caption: string;
  @Input() regular = false;
  captains: Map<number, string>;

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

  ngOnInit(): void {
    if (this.lineup) {
      this.captains = new Map();
      this.captains.set(this.lineup.captain_id ?? 0, 'C');
      this.captains.set(this.lineup.vcaptain_id ?? 0, 'VC');
      this.captains.set(this.lineup.vvcaptain_id ?? 0, 'VVC');
    }
    this.dataSource = new MatTableDataSource(this.dispositions);
  }
}
