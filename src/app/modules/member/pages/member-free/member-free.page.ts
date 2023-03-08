import { KeyValue, NgFor, NgIf, AsyncPipe, KeyValuePipe } from '@angular/common';
import { AfterViewInit, Component, HostBinding, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
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
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    MatIconModule,
    MemberListComponent,
    AsyncPipe,
    KeyValuePipe,
  ],
})
export class MemberFreePage implements AfterViewInit {
  @HostBinding('@tableRowAnimation') protected tableRowAnimation = '';
  @ViewChild(MemberListComponent) protected memberList?: MemberListComponent;

  public members$?: Observable<Array<Member>>;
  public selectedMember$?: Observable<Member | undefined>;
  public role$: BehaviorSubject<Role | undefined>;
  protected readonly roles: Map<number, Role>;
  private readonly championship$: Observable<Championship>;

  constructor(
    protected readonly app: ApplicationService,
    private readonly memberService: MemberService,
    private readonly roleService: RoleService,
  ) {
    this.championship$ = getRouteData<Championship>('championship');
    this.roles = this.roleService.list();
    this.role$ = new BehaviorSubject(this.roles.get(0));
    this.members$ = this.getMembers();
  }

  public ngAfterViewInit(): void {
    this.selectedMember$ = this.getSelectedMember();
  }

  protected track(_: number, item: KeyValue<number, Role>): number {
    return item.value.id; // or item.id
  }

  protected compareRole(role1?: Role, role2?: Role): boolean {
    return role1?.id === role2?.id;
  }

  private getMembers(): Observable<Array<Member>> {
    return combineLatest([this.role$, this.championship$]).pipe(
      switchMap(([role, c]) => this.memberService.getFree(c.id, role?.id)),
    );
  }

  private getSelectedMember(): Observable<Member | undefined> | undefined {
    return this.memberList?.selection.changed.pipe(map((m) => m.source.selected[0]));
  }
}
