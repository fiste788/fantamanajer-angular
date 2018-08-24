import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'fm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  public tabs: any = [
    { label: 'Profilo', link: '../profile' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor() { }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
  }

}
