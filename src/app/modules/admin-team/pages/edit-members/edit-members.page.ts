import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { MemberService, RoleService, TeamService } from '@data/services';
import { Member, Module, Role, Team } from '@data/types';

interface Data {
  dispositions: Array<{ member: Member }>;
  membersByRole: Map<Role, Array<Member>>;
}
@Component({
  styleUrls: ['./edit-members.page.scss'],
  templateUrl: './edit-members.page.html',
})
export class EditMembersPage {
  @ViewChild(NgForm) protected membersForm?: NgForm;

  protected readonly roles: Map<number, Role>;
  protected readonly module: Module;
  protected readonly data$: Observable<Data>;
  protected readonly team$: Observable<Team>;

  constructor(
    private readonly roleService: RoleService,
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
  ) {
    this.team$ = getRouteData<Team>('team');
    this.roles = this.roleService.list();
    this.module = this.roleService.getModule();
    this.data$ = this.team$.pipe(switchMap((team) => this.loadData(team)));
  }

  protected loadData(team: Team): Observable<Data> {
    return forkJoin([
      this.memberService.getByTeamId(team.id),
      this.memberService.getAllFree(team.championship_id),
    ]).pipe(
      map(([teamMembers, allMembers]) => {
        const members = this.fixMissingMembers(team.members ?? [], teamMembers);
        const dispositions = members.map((member) => ({ member }));

        // eslint-disable-next-line unicorn/no-array-reduce
        const membersByRole = this.roleService.values().reduce((m, c) => {
          return m.set(c, [
            ...members.filter((entry) => entry.role_id === c.id),
            ...allMembers[c.id]!,
          ]);
        }, new Map<Role, Array<Member>>());

        return { dispositions, membersByRole };
      }),
    );
  }

  protected async save(team: Team, dispositions: Array<{ member: Member }>): Promise<void> {
    if (this.membersForm?.valid) {
      team.members = dispositions.map((m) => m.member);

      return save(this.teamService.update(team), undefined, {
        message: 'Giocatori modificati',
        form: this.membersForm,
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

  private fixMissingMembers(members: Array<Member>, teamMembers: Array<Member>): Array<Member> {
    const membersCount = this.roleService.totalMembers();
    teamMembers.slice(0, membersCount);
    if (members.length < membersCount) {
      const missing = Array.from<Member>({
        length: membersCount - members.length,
      }).fill({} as Member);

      return [...members, ...missing];
    }

    return members;
  }
}
