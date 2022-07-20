import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { MemberService, RoleService, TeamService } from '@data/services';
import { Member, Module, Role, Team } from '@data/types';

@Component({
  styleUrls: ['./edit-members.page.scss'],
  templateUrl: './edit-members.page.html',
})
export class EditMembersPage {
  @ViewChild(NgForm) protected membersForm?: NgForm;

  protected readonly roles: Map<number, Role>;
  protected readonly module: Module;
  protected readonly controlsByRole$: Observable<boolean>;
  protected readonly team$: Observable<Team>;
  protected members!: Array<{ member: Member }>;
  protected membersByRole!: Map<Role, Array<Member>>;

  constructor(
    private readonly roleService: RoleService,
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.roles = this.roleService.list();
    const key = Array.from(this.roles.values())
      .map((r) => r.count)
      .join('-');
    this.module = new Module(key, this.roles);
    this.team$ = getRouteData<Team>('team');
    this.controlsByRole$ = this.team$.pipe(switchMap((team) => this.loadMembers(team)));
  }

  protected loadMembers(team: Team): Observable<boolean> {
    return forkJoin([
      this.memberService.getByTeamId(team.id),
      this.memberService.getAllFree(team.championship_id),
    ]).pipe(
      map(([teamMembers, allMembers]) => {
        team.members = teamMembers.slice(0, this.roleService.totalMembers());
        if (team.members.length < this.roleService.totalMembers()) {
          const missing = new Array<Member>(
            this.roleService.totalMembers() - team.members.length,
          ).fill({} as Member);
          team.members = [...team.members, ...missing];
        }
        this.members = team.members.map((member) => ({ member }));
        this.membersByRole = Array.from(this.roles.values()).reduce((m, c) => {
          const members = team.members
            .filter((entry) => entry.role_id === c.id)
            .concat(allMembers[c.id]!);

          return m.set(c, members);
        }, new Map<Role, Array<Member>>());

        return true;
      }),
    );
  }

  protected compareTeam(c1: Team | null, c2: Team | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected compareMember(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected async save(team: Team): Promise<void> {
    team.members = this.members.map((m) => m.member);
    return firstValueFrom(
      this.teamService.update(team).pipe(
        map(() => {
          this.snackBar.open('Giocatori modificati');
        }),
        catchError((err: unknown) => getUnprocessableEntityErrors(err, this.membersForm)),
      ),
      { defaultValue: undefined },
    );
  }
}
