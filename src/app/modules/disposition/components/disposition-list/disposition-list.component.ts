import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Disposition, Lineup } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-disposition-list[caption]',
  styleUrls: ['./disposition-list.component.scss'],
  templateUrl: './disposition-list.component.html',
})
export class DispositionListComponent implements OnInit {
  @Input() public caption!: string;
  @Input() public lineup?: Lineup;
  @Input() public dispositions?: Array<Disposition>;
  @Input() public regular = false;

  protected dataSource!: MatTableDataSource<Disposition>;
  protected readonly displayedColumns = [
    'player',
    'role',
    'club',
    'regular',
    'yellow-card',
    'red-card',
    'assist',
    'goals',
    'points',
  ];

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dispositions);
  }

  protected trackDisposition(_: number, item: Disposition): number {
    return item.id;
  }
}
