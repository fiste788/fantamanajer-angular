import { Component, OnInit, Input } from '@angular/core';
import { Member } from '../member';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'fm-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];

  constructor() {
    this.members = [];
  }

  ngOnInit() {
  }

}
