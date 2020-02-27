import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { tableRowAnimation } from '@app/core/animations';
import { Disposition, Lineup } from '@app/shared/models';

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
    this.dataSource = new MatTableDataSource(this.dispositions);
  }
}
