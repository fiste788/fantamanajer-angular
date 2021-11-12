import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { MemberService, RoleService, TeamService } from '@data/services';
import { UtilService } from '@app/services';
import { Member, Module, Role, Team } from '@data/types';

@Component({
  styleUrls: ['./edit-members.page.scss'],
  templateUrl: './edit-members.page.html',
})
export class EditMembersPage {
  @ViewChild(NgForm) public membersForm?: NgForm;

  public roles: Map<number, Role>;
  public module: Module;
  public controlsByRole$: Observable<boolean>;
  public team$: Observable<Team>;
  public members!: Array<{ member: Member }>;
  public membersByRole!: Map<Role, Array<Member>>;

  constructor(
    private readonly roleService: RoleService,
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
  ) {
    this.roles = this.roleService.list();
    const key = Array.from(this.roles.values())
      .map((r) => r.count)
      .join('-');
    this.module = new Module(key, this.roles);
    this.team$ = UtilService.getData<Team>(this.route, 'team');
    this.controlsByRole$ = this.team$.pipe(switchMap((team) => this.loadMembers(team)));
  }

  public loadMembers(team: Team): Observable<boolean> {
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
            .concat(allMembers[c.id]);

          return m.set(c, members);
        }, new Map<Role, Array<Member>>());

        return true;
      }),
    );
  }

  public compareTeam(c1: Team | null, c2: Team | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  public compareMember(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  public async save(team: Team): Promise<void> {
    team.members = this.members.map((m) => m.member);
    return firstValueFrom(
      this.teamService.update(team).pipe(
        map(() => {
          this.snackBar.open('Giocatori modificati', undefined, {
            duration: 3000,
          });
        }),
        catchError((err: unknown) =>
          UtilService.getUnprocessableEntityErrors(err, this.membersForm),
        ),
      ),
      { defaultValue: undefined },
    );
  }
}
