import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, map, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { MemberService, RoleService, TeamService } from '@data/services';
import { Member, Role, Team } from '@data/types';
import { ModuleAreaComponent } from '@modules/lineup/components/module-area/module-area.component';

interface Data {
  dispositions: Array<{
    member: Member;
  }>;
  membersByRole: Map<Role, Array<Member>>;
}
@Component({
  templateUrl: './edit-members.page.html',
  imports: [FormsModule, ModuleAreaComponent, MatButtonModule, MatProgressSpinnerModule, AsyncPipe],
})
export class EditMembersPage {
  readonly #roleService = inject(RoleService);
  readonly #teamService = inject(TeamService);
  readonly #memberService = inject(MemberService);
  readonly #snackbar = inject(MatSnackBar);

  protected readonly roles = inject(RoleService).list();
  protected readonly module = inject(RoleService).getModuleKey();
  protected readonly team$ = getRouteData<Team>('team');
  protected readonly data$ = this.team$.pipe(switchMap((team) => this.loadData(team)));

  protected loadData(team: Team): Observable<Data> {
    return forkJoin([
      this.#memberService.getMembersByTeamId(team.id),
      this.#memberService.getAllFreeMembers(team.championship_id),
    ]).pipe(
      map(([teamMembers, allMembers]) => {
        const members = this.#fixMissingMembers(teamMembers);
        const dispositions = members.map((member) => ({ member }));

        // eslint-disable-next-line unicorn/no-array-reduce
        const membersByRole = this.roles.reduce((m, c) => {
          return m.set(c, [
            ...members.filter((entry) => entry.role_id === c.id),
            ...allMembers[c.id]!,
          ]);
        }, new Map<Role, Array<Member>>());

        return { dispositions, membersByRole };
      }),
    );
  }

  protected async save(
    team: Team,
    dispositions: Array<{
      member: Member;
    }>,
    membersForm: NgForm,
  ): Promise<void> {
    if (membersForm.valid) {
      team.members = dispositions.map((m) => m.member);

      return save(this.#teamService.updateTeam(team), undefined, this.#snackbar, {
        message: 'Giocatori modificati',
        form: membersForm,
      });
    }

    return undefined;
  }

  protected compareTeam(c1: Team | null, c2: Team | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected compareMember(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  #fixMissingMembers(teamMembers: Array<Member>): Array<Member> {
    const membersCount = this.#roleService.totalMembers();
    const members = teamMembers.slice(0, membersCount);
    if (members.length < membersCount) {
      const missing = Array.from<Member>({
        length: membersCount - members.length,
      }).fill({} as Member);

      return [...members, ...missing];
    }

    return members;
  }
}
