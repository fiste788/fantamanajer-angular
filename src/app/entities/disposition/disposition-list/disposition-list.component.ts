import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Disposition } from '../../disposition/disposition';
import { Router, RouterModule } from '@angular/router';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss'],
  animations: [TableRowAnimation]
})
export class DispositionListComponent implements OnInit {
  @Input() public dispositions: Disposition[];
  @Input() public caption: string;

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
    this.dataSource = new MatTableDataSource(this.dispositions);
  }
}

