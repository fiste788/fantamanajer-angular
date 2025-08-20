import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { combineLatest, Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { MemberService, RoleService } from '@data/services';
import { Championship, Member, Role } from '@data/types';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  styleUrl: './member-free.page.scss',
  templateUrl: './member-free.page.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MemberListComponent,
    AsyncPipe,
  ],
})
export class MemberFreePage {
  readonly #memberService = inject(MemberService);
  readonly #championship$ = getRouteData<Championship>('championship');

  public readonly roles = inject(RoleService).list();
  public role = signal(this.roles[0]!);
  public members$ = this.#getMembers(toObservable(this.role));
  public selectedMember?: Member | undefined;

  protected readonly app = inject(ApplicationService);

  protected setSelectedMember(member: Array<Member>): void {
    [this.selectedMember] = member;
  }

  protected compareRole(role1?: Role, role2?: Role): boolean {
    return role1?.id === role2?.id;
  }

  #getMembers(role$: Observable<Role>): Observable<Array<Member>> {
    return combineLatest([role$, this.#championship$]).pipe(
      switchMap(([role, c]) => this.#memberService.getFreeMembers(c.id, role.id)),
    );
  }
}
