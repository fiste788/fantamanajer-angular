import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { MemberService, RoleService, TeamService } from '@app/http';
import { UtilService } from '@app/services';
import { Member, Role, Team } from '@shared/models';

interface TeamMembers {
  controls: Array<number>;
  members: Array<Member>;
}

@Component({
  selector: 'fm-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent implements OnInit {
  @ViewChild(NgForm) membersForm: NgForm;

  membersControls: FormArray;
  roles: Map<number, Role> = new Map<number, Role>();
  controlsByRole: Map<Role, TeamMembers> = new Map<Role, TeamMembers>();
  members: Map<Role, Array<Member>> = new Map<Role, Array<Member>>();
  team: Team;
  isAlreadySelectedCallback: () => boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly roleService: RoleService,
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cd: ChangeDetectorRef
  ) {
    this.roles = this.roleService.list();
  }

  ngOnInit(): void {
    const t = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (t) {
      this.team = t;
      this.loadMembers(this.team);
      this.cd.detectChanges();
      this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this);
    }
  }

  loadMembers(team: Team): void {
    this.membersControls = new FormArray([]);
    this.memberService.getByTeamId(team.id)
      .subscribe(members => {
        this.team.members = members.slice(0, this.roleService.totalMembers());
        this.memberService.getAllFree(this.team.championship_id)
          .subscribe(res => {
            this.roles.forEach((role, key) => {
              const m = this.team.members.filter(entry => entry !== undefined && entry.role_id === key)
                .concat(res[key]);
              this.members.set(role, m);
              this.controlsByRole.set(role, { members: m, controls: [] });
              for (let i = 0; i < role.count; i++) {
                const c = this.createItem(this.team.members.shift());
                this.controlsByRole.get(role)
                  ?.controls
                  .push(this.getIndex(role, i));
                this.membersControls.push(c);
              }

            });
          });

      });
  }

  getIndex(key: Role, key2: number): number {
    let count = 0;
    let i = 0;
    const keys = Array.from(this.roles.keys());
    const index = keys.indexOf(key.id);
    for (i = 0; i < index; i++) {
      const l = Array.from(this.roles.values());
      if (l !== undefined) {
        count += l[i]?.count ?? 0;
      }
    }

    return count + key2;
  }

  createItem(member?: Member): FormControl {
    return this.fb.control(member);
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
    this.teamService.update(this.team)
      .subscribe(() => {
        this.snackBar.open('Giocatori modificati', undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.membersForm, err);
        }
      );
  }

  track(_: number, item: KeyValue<Role, TeamMembers>): number {
    return item.key.id; // or item.id
  }

  trackByMember(_: number): number {
    return _; // or item.id
  }
}
