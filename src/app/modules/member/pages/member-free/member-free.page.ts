import { KeyValue } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService, RoleService } from '@app/http';
import { ApplicationService, UtilService } from '@app/services';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';
import { tableRowAnimation } from '@shared/animations';
import { Championship, Member, Role } from '@shared/models';

@Component({
  templateUrl: './member-free.page.html',
  styleUrls: ['./member-free.page.scss'],
  animations: [tableRowAnimation]
})
export class MemberFreePage implements OnInit, AfterViewInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  @ViewChild(MemberListComponent) memberList?: MemberListComponent;
  @ViewChild(MatSelect) roleSelect: MatSelect;

  members$?: Observable<Array<Member>>;
  roles: Map<number, Role>;

  constructor(
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly roleService: RoleService,
    public app: ApplicationService
  ) {
  }

  ngOnInit(): void {
    this.roles = this.roleService.list();
  }

  ngAfterViewInit(): void {
    this.roleSelect.selectionChange.subscribe((change: MatSelectChange) => {
      this.roleChange(change.value);
    });
    this.roleSelect.value = this.roles.get(1);
    this.roleChange(this.roles.get(1));
  }

  roleChange(role?: Role): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    this.members$ = undefined;
    this.changeRef.detectChanges();
    if (championship) {
      this.members$ = this.memberService.getFree(championship.id, role?.id);
    }
  }

  track(_: number, item: KeyValue<number, Role>): number {
    return item.value.id; // or item.id
  }
}
