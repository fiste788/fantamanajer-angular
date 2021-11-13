import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Disposition, Lineup } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-disposition-list',
  styleUrls: ['./disposition-list.component.scss'],
  templateUrl: './disposition-list.component.html',
})
export class DispositionListComponent implements OnInit {
  @Input() public lineup?: Lineup;
  @Input() public dispositions?: Array<Disposition>;
  @Input() public caption = '';
  @Input() public regular = false;

  public dataSource!: MatTableDataSource<Disposition>;
  public displayedColumns = [
    'player',
    'role',
    'club',
    'regular',
    'yellowCard',
    'redCard',
    'assist',
    'goals',
    'points',
  ];

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dispositions);
  }
}
