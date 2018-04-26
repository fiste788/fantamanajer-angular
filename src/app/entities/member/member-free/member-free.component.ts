import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { MemberListComponent } from '../member-list/member-list.component';
import { Role } from '../../role/role';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ApplicationService } from 'app/core/application.service';

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
    private app: ApplicationService
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
    this.members = null;
    this.changeRef.detectChanges();
    this.members = this.memberService
      .getFree(this.app.championship.id, this.selectedRole.id)
      .pipe(share());
  }
}
