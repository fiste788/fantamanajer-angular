import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../member';
import {
  MemberListComponent,
  MemberDataSource
} from '../member-list/member-list.component';
import { Role } from '../../role/role';
import { SharedService } from '../../shared/shared.service';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'fm-member-free',
  templateUrl: './member-free.component.html',
  styleUrls: ['./member-free.component.scss']
})
export class MemberFreeComponent implements OnInit {
  @ViewChild(MemberListComponent) memberList: MemberListComponent;
  members: Observable<Member[]>;
  selectedRole: Role;
  roles: Role[] = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private shared: SharedService
  ) {
    this.roles.push(new Role(1, 'Portiere'));
    this.roles.push(new Role(2, 'Difensore'));
    this.roles.push(new Role(3, 'Centrocampista'));
    this.roles.push(new Role(4, 'Attaccante'));
    this.selectedRole = this.roles[0];
  }

  ngOnInit() {
    this.roleChange();
  }

  roleChange() {
    console.log('log change');
    this.members = this.memberService
      .getFree(this.shared.currentChampionship.id, this.selectedRole.id)
      .pipe(share());
    this.members.subscribe(members => {
      this.memberList.members = of(members);
      this.memberList.dataSource = new MemberDataSource(this.memberList);
    });
  }
}
