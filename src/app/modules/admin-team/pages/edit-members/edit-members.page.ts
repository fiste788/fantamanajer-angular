import { KeyValue } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MemberService, RoleService, TeamService } from '@app/http';
import { UtilService } from '@app/services/';
import { Member, Role, Team } from '@shared/models';

interface TeamMembers {
  controls: Array<number>;
  members: Array<Member>;
}

@Component({
  templateUrl: './edit-members.page.html',
  styleUrls: ['./edit-members.page.scss']
})
export class EditMembersPage implements OnInit {
  @ViewChild(NgForm) membersForm: NgForm;

  membersControls: FormArray;
  controlsByRole$: Observable<Map<Role, TeamMembers>>;
  team: Team;
  isAlreadySelectedCallback: () => boolean;
  private readonly roles: Map<number, Role> = new Map<number, Role>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly roleService: RoleService,
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {
    this.roles = this.roleService.list();
  }

  ngOnInit(): void {
    const t = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (t) {
      this.team = t;
      this.loadMembers(this.team);
      this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this);
    }
  }

  loadMembers(team: Team): void {
    this.membersControls = new FormArray([]);
    this.controlsByRole$ = forkJoin(
      this.memberService.getByTeamId(team.id),
      this.memberService.getAllFree(team.championship_id)
    )
      .pipe(
        map(([teamMembers, allMembers]) => {
          const m = new Map<Role, TeamMembers>();
          this.team.members = teamMembers.slice(0, this.roleService.totalMembers());
          this.roles.forEach((role, roleId) => {
            const members = this.team.members.filter(entry => entry !== undefined && entry.role_id === roleId)
              .concat(allMembers[roleId]);
            const controls: Array<number> = [];
            Array(role.count)
              .forEach((_, i) => {
                const index = this.getIndex(role, i);
                const c = this.createItem(this.team.members[index]);
                this.membersControls.push(c);
                controls.push(index);
              });
            m.set(role, { members, controls });
          });

          return m;
        }));
  }

  getIndex(role: Role, memberKey: number): number {
    return Array.from(this.roles.entries())
      .filter(([n]) => n < role.id)
      .map(([_, v]) => v)
      .reduce((c, v) => c + v.count, memberKey);
  }

  createItem(member?: Member): FormControl {
    return this.fb.control(member, Validators.required);
  }

  isAlreadySelected(member: Member): boolean {
    return this.team.members.filter(element => element !== undefined)
      .includes(member);
  }

  compareTeam(c1: Team, c2: Team): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  compareMember(c1: Member, c2: Member): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  save(): void {
    this.team.members = this.membersControls.value;
    this.teamService.update(this.team)
      .subscribe(() => {
        this.snackBar.open('Giocatori modificati', undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.membersControls, err);
        }
      );
  }

  track(_: number, item: KeyValue<Role, TeamMembers>): number {
    return item.key.id; // or item.id
  }

  trackByMember(index: number): number {
    return index; // or item.id
  }
}
