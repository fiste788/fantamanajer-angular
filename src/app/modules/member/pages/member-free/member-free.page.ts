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

import { combineLatest, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { AppService } from '@app/services';
import type { Championship, Member, Role } from '@data/interfaces';
import { MemberService, RoleService } from '@data/services';
import { MemberListComponent } from '@modules/member/components/member-list/member-list.component';

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatOptionModule, MatSelectModule, MemberListComponent, RouterLink],
  templateUrl: './member-free.page.html',
  styleUrl: './member-free.page.scss',
})
export class MemberFreePage {

  readonly #memberService = inject(MemberService);
  protected readonly app = inject(AppService);
  public readonly roles = inject(RoleService).list();

  public readonly role = signal(this.roles[0]!);

  public members$ = this.#getMembers(toObservable(this.role));
  public selectedMember?: Member | undefined;

  readonly #championship$ = getRouteData<Championship>('championship');

  protected compareRole(role1?: Role, role2?: Role): boolean {
    return role1?.id === role2?.id;
  }

  protected setSelectedMember(member: Member[]): void {
    const [value] = member;
    this.selectedMember = value;
  }

  #getMembers(role$: Observable<Role>): Observable<Member[]> {
    return combineLatest([role$, this.#championship$]).pipe(switchMap(([role, c]) => this.#memberService.getFreeMembers(c.id, role.id)));
  }

}
