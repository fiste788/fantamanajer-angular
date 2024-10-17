import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { addVisibleClassOnDestroy, getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Championship, Member, Role } from '@data/types';
import { MemberListComponent } from '@modules/member-common/components/member-list/member-list.component';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrl: './member-free.page.scss',
  templateUrl: './member-free.page.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    MatIconModule,
    MemberListComponent,
    AsyncPipe,
  ],
})
export class MemberFreePage {
  readonly #memberService = inject(MemberService);
  readonly #championship$ = getRouteData<Championship>('championship');

  @HostBinding('@tableRowAnimation')
  protected tableRowAnimation = '';

  public readonly roles = inject(RoleService).list();
  public role$ = new BehaviorSubject(this.roles[0]!);
  public members$ = this.#getMembers();
  public selectedMember?: Member | undefined;

  protected readonly app = inject(ApplicationService);

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected setSelectedMember(member: Array<Member>): void {
    [this.selectedMember] = member;
  }

  protected compareRole(role1?: Role, role2?: Role): boolean {
    return role1?.id === role2?.id;
  }

  #getMembers(): Observable<Array<Member>> {
    return combineLatest([this.role$, this.#championship$]).pipe(
      switchMap(([role, c]) => this.#memberService.getFree(c.id, role.id)),
    );
  }
}
