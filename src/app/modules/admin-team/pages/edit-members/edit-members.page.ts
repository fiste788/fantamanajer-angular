import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin, map, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { Member, Role, Team } from '@data/interfaces';
import { MemberService, RoleService, TeamService } from '@data/services';
import { ModuleAreaComponent } from '@modules/lineup/components/module-area/module-area.component';

interface Data {
  dispositions: {
    member: Partial<Member>;
  }[];
  membersByRole: Map<Role, Member[]>;
}

const createEmptyMember = (): Partial<Member> => ({});

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatProgressSpinnerModule, ModuleAreaComponent],
  templateUrl: './edit-members.page.html',
})
export class EditMembersPage {

  readonly #memberService = inject(MemberService);
  readonly #roleService = inject(RoleService);
  readonly #snackbar = inject(MatSnackBar);
  readonly #teamService = inject(TeamService);
  protected readonly module = inject(RoleService).getModuleKey();
  protected readonly roles = inject(RoleService).list();

  protected readonly team$ = getRouteData<Team>('team');
  protected readonly data$ = this.team$.pipe(switchMap(team => this.loadData(team)));

  protected compareMember(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected compareTeam(c1: Team | null, c2: Team | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected loadData(team: Team): Observable<Data> {
    return forkJoin([this.#memberService.getMembersByTeamId(team.id), this.#memberService.getAllFreeMembers(team.championship_id)]).pipe(
      map(([teamMembers, allMembers]) => {
        const membersCount = this.#roleService.totalMembers();

        // 1. Teniamo solo i membri REALI (niente fakes qui dentro)
        const realMembers = teamMembers.slice(0, membersCount);
        const members = this.#fixMissingMembers(teamMembers);
        const dispositions = members.map(member => ({ member }));

        // eslint-disable-next-line unicorn/no-array-reduce
        const membersByRole = this.roles.reduce(
          (m, c) => m.set(c, [...realMembers.filter(entry => entry.role_id === c.id), ...allMembers[c.id]!]),
          new Map<Role, Member[]>(),
        );

        return { dispositions, membersByRole };
      }),
    );
  }

  protected async save(
    team: Team,
    dispositions: {
      member: Partial<Member>;
    }[],
    membersForm: NgForm,
  ): Promise<void> {
    if (membersForm.valid) {
      team.members = dispositions.map(m => m.member).splice(0, this.#roleService.totalMembers()) as Member[];

      return save(this.#teamService.updateTeam(team), undefined, this.#snackbar, {
        form: membersForm,
        message: 'Giocatori modificati',
      });
    }

    return undefined;
  }

  #fixMissingMembers(teamMembers: Member[]): Partial<Member>[] {
    const membersCount = this.#roleService.totalMembers();
    const members = teamMembers.slice(0, membersCount);
    if (members.length < membersCount) {
      const missing = Array.from(
        {
          length: membersCount - members.length,
        },
        () => createEmptyMember(),
      );
      return [...members, ...missing];
    }

    return members;
  }

}
