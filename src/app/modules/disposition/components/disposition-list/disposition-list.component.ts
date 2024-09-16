import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { addVisibleClassOnDestroy } from '@app/functions';
import { Disposition, Lineup } from '@data/types';
import { tableRowAnimation } from '@shared/animations';
import { CaptainPipe } from '@shared/pipes';

@Component({
  animations: [tableRowAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-disposition-list[caption]',
  styleUrl: './disposition-list.component.scss',
  templateUrl: './disposition-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    CaptainPipe,
    MatCardModule,
    DecimalPipe,
  ],
})
export class DispositionListComponent implements OnInit {
  public caption = input.required<string>();
  public lineup = input<Lineup>();
  public dispositions = input<Array<Disposition>>();
  public regular = input(false, { transform: booleanAttribute });

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

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dispositions());
  }

  protected trackDisposition(_: number, item: Disposition): number {
    return item.id;
  }
}
