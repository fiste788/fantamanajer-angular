import { Component, OnInit, Input } from '@angular/core';
import { Disposition } from '../../disposition/disposition';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss']
})
export class DispositionListComponent implements OnInit {

  @Input() public dispositions: Disposition[];
  @Input() public caption: string;

  constructor() {
    this.dispositions = [];
  }

  ngOnInit() {
  }

}
