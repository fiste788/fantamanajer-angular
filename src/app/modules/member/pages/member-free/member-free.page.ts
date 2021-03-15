import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { MemberService, RoleService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';
import { tableRowAnimation } from '@shared/animations';
import { Championship, Member, Role } from '@data/types';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./member-free.page.scss'],
  templateUrl: './member-free.page.html',
})
export class MemberFreePage implements OnInit {
  @HostBinding('@tableRowAnimation') public tableRowAnimation = '';
  @ViewChild(MemberListComponent) public memberList?: MemberListComponent;

  public members$?: Observable<Array<Member>>;
  public roles: Map<number, Role>;
  public selectedMember$: Observable<Member | undefined>;
  public role: Role | undefined;

  constructor(
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly roleService: RoleService,
    public app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.roles = this.roleService.list();
    this.roleChange(this.roles.get(0));
  }

  public roleChange(role?: Role): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    this.members$ = undefined;
    this.changeRef.detectChanges();
    if (championship) {
      this.members$ = this.memberService.getFree(championship.id, role?.id).pipe(
        tap(() => {
          if (this.memberList) {
            this.selectedMember$ = this.memberList.selection.changed
              .asObservable()
              .pipe(map((m) => m.source.selected[0]));
          }
        }),
      );
    }
  }

  public track(_: number, item: KeyValue<number, Role>): number {
    return item.value.id; // or item.id
  }
}
