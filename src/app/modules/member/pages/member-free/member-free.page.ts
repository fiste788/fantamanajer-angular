import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Championship, Member, Role } from '@data/types';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./member-free.page.scss'],
  templateUrl: './member-free.page.html',
})
export class MemberFreePage implements OnInit {
  @HostBinding('@tableRowAnimation') protected tableRowAnimation = '';
  @ViewChild(MemberListComponent) protected memberList?: MemberListComponent;

  public members$?: Observable<Array<Member>>;
  public selectedMember$?: Observable<Member | undefined>;
  public role: Role | undefined;
  protected readonly roles: Map<number, Role>;

  constructor(
    protected readonly app: ApplicationService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly roleService: RoleService,
  ) {
    this.roles = this.roleService.list();
  }

  public ngOnInit(): void {
    this.roleChange(this.roles.get(0));
  }

  protected roleChange(role?: Role): void {
    this.members$ = undefined;
    this.changeRef.detectChanges();
    this.members$ = getRouteData<Championship>('championship').pipe(
      switchMap((c) => this.memberService.getFree(c.id, role?.id)),
    );

    if (this.memberList) {
      this.selectedMember$ = this.memberList.selection.changed.pipe(
        map((m) => m.source.selected[0]),
      );
    }
  }

  protected track(_: number, item: KeyValue<number, Role>): number {
    return item.value.id; // or item.id
  }
}
