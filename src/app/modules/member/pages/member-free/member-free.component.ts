import { KeyValue } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MemberService, RoleService } from '@app/core/http';
import { ApplicationService, UtilService } from '@app/core/services';
import { MemberListComponent } from '@app/modules/member-common/components/member-list/member-list.component';
import { tableRowAnimation } from '@app/shared/animations';
import { Member, Role } from '@app/shared/models';
import { Observable } from 'rxjs';

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
  members?: Observable<Array<Member>>;
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
    const championshipId = UtilService.getChampionshipId(this.route);
    this.members = undefined;
    this.changeRef.detectChanges();
    if (championshipId) {
      this.members = this.memberService.getFree(championshipId, role?.id);
    }
  }

  track(_: number, item: KeyValue<number, Role>): number {
    return item.value.id; // or item.id
  }
}
