import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { SharedService } from 'app/shared/shared.service';
import { ApplicationService } from 'app/core/application.service';
import { MemberService } from '../member.service';
import { MemberListComponent } from '../member-list/member-list.component';
import { Member } from '../member';
import { Role } from '../../role/role';

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
    private route: ActivatedRoute,
    private shared: SharedService,
    public app: ApplicationService
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
      .getFree(this.shared.getChampionshipId(this.route), this.selectedRole.id)
      .pipe(share());
  }
}
