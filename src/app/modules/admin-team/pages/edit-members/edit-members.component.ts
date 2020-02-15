import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Member, Role, Team } from '@app/core/models';
import { MemberService, TeamService } from '@app/core/services';
import { SharedService } from '@app/shared/services/shared.service';

interface TeamMembers {
  count: number;
  label: string;
  entries?: Array<any>;
  members?: Array<Member>;
}

@Component({
  selector: 'fm-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent implements OnInit {

  roles: Map<Role, TeamMembers> = new Map<Role, TeamMembers>();
  team: Team;
  @ViewChild(NgForm) membersForm: NgForm;
  isAlreadySelectedCallback: () => boolean;

  constructor(
    private readonly teamService: TeamService,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cd: ChangeDetectorRef
  ) {
    this.roles.set(new Role(1, 'P'), { count: 3, label: 'Portiere' });
    this.roles.set(new Role(2, 'D'), { count: 8, label: 'Difensore' });
    this.roles.set(new Role(3, 'C'), { count: 8, label: 'Centrocampista' });
    this.roles.set(new Role(4, 'A'), { count: 6, label: 'Attaccante' });

  }

  ngOnInit(): void {
    this.route.parent?.parent?.parent?.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.loadMembers(this.team);
      this.cd.detectChanges();
      this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this);
    });
  }

  loadMembers(team: Team): void {
    this.memberService.getByTeamId(team.id)
      .subscribe(members => {
        this.team.members = members.slice(0, 25);
        this.roles.forEach((val, key) => {
          const role = this.roles.get(key);
          if (role) {
            role.entries = Array(val.count);
          }
        });
        this.memberService.getAllFree(this.team.championship_id)
          .subscribe(res => {
            this.roles.forEach((value, key) => {
              value.members = this.team.members.filter(entry => entry !== undefined && entry.role_id === key.id);
              value.members = value.members.concat(res[key.id]);
            });
          });

      });
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

  getIndex(key: Role, key2: number): number {
    let count = 0;
    let i = 0;
    const keys = Array.from(this.roles.keys());
    const index = keys.indexOf(key);
    for (i = 0; i < index; i++) {
      const l = Array.from(this.roles.values());
      if (l !== undefined) {
        count += l[i]?.entries?.length ?? 0;
      }
    }

    return count + key2;
  }

  save(): void {
    this.teamService.update(this.team)
      .subscribe(() => {
        this.snackBar.open('Giocatori modificati', undefined, {
          duration: 3000
        });
      },
        err => {
          SharedService.getUnprocessableEntityErrors(this.membersForm, err);
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
