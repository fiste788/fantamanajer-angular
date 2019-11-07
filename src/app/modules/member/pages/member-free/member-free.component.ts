import { Component, ViewChild, ChangeDetectorRef, OnInit, HostBinding, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { SharedService } from '@app/shared/services/shared.service';
import { ApplicationService, MemberService, RoleService } from '@app/core/services';
import { MemberListComponent } from '@app/modules/member-common/components/member-list/member-list.component';
import { Member, Role } from '@app/core/models';
import { tableRowAnimation } from '@app/core/animations';
import { MatSelectChange, MatSelect } from '@angular/material/select';

@Component({
  selector: 'fm-member-free',
  templateUrl: './member-free.component.html',
  styleUrls: ['./member-free.component.scss'],
  animations: [tableRowAnimation]
})
export class MemberFreeComponent implements OnInit, AfterViewInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  @ViewChild(MemberListComponent) memberList: MemberListComponent;
  @ViewChild(MatSelect) roleSelect: MatSelect;
  members: Observable<Member[]>;
  roles: Map<number, Role>;

  constructor(
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private roleService: RoleService,
    public app: ApplicationService
  ) {
  }

  ngOnInit() {
    this.roles = this.roleService.list();
  }

  ngAfterViewInit() {
    this.roleSelect.selectionChange.subscribe((change: MatSelectChange) => this.roleChange(change.value));
    this.roleSelect.value = this.roles.get(1);
    this.roleChange(this.roles.get(1));
  }

  roleChange(role: Role) {
    this.members = null;
    this.changeRef.detectChanges();
    this.members = this.memberService.getFree(SharedService.getChampionshipId(this.route), role.id);
  }
}
