import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../../shared/shared.service';
import { MemberService } from '../../../entities/member/member.service';
import { TeamService } from '../../../entities/team/team.service';
import { Role } from '../../../entities/role/role';
import { Member } from '../../../entities/member/member';
import { Team } from '../../../entities/team/team';

@Component({
  selector: 'fm-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent implements OnInit {

  public roles: Map<Role, {
    count: number,
    label: string,
    entries?: any[],
    members?: Member[]
  }> = new Map<Role, {
    count: number,
    label: string,
    entries: any[],
    members: Member[]
  }>();
  public team: Team;
  @ViewChild(NgForm) membersForm: NgForm;
  isAlreadySelectedCallback: Function;

  constructor(private teamService: TeamService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private sharedService: SharedService) {
    this.roles.set(new Role(1, 'P'), { count: 3, label: 'Portiere' });
    this.roles.set(new Role(2, 'D'), { count: 8, label: 'Difensore' });
    this.roles.set(new Role(3, 'C'), { count: 8, label: 'Centrocampista' });
    this.roles.set(new Role(4, 'A'), { count: 6, label: 'Attaccante' });

  }


  ngOnInit() {
    this.route.parent.parent.parent.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.loadMembers(this.team);
      this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this);
    });
  }

  loadMembers(team: Team) {
    this.memberService.getByTeamId(team.id).subscribe(members => {
      this.team.members = members;
      let i = 0;
      for (i = 0; i < 25; i++) {
        if (this.team.members.length < i) {
          this.team.members[i] = null;
        }
      }
      this.roles.forEach((val, key) => {
        this.roles.get(key).entries = Array(val.count);

      });
      this.memberService.getAllFree(this.team.championship_id).subscribe(res => {
        this.roles.forEach((value, key) => {
          value.members = this.team.members.filter(entry => entry && entry.role_id === key.id);
          value.members = value.members.concat(res[key.id]);
        });
      });

    });
  }

  isAlreadySelected(member: Member): boolean {
    return this.team.members
      .filter(element => element != null)
      // .map(element => member.id)
      .includes(member);
  }

  compareTeam(c1: Team, c2: Team): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareMember(c1: Member, c2: Member): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getIndex(key, key2): number {
    let count = 0;
    let i = 0;
    const keys = Array.from(this.roles.keys());
    const index = keys.indexOf(key);
    for (i = 0; i < index; i++) {
      count += Array.from(this.roles.values())[i].entries.length;
    }
    return count + key2;
  }

  save() {
    this.teamService.update(this.team).subscribe(response => {
      this.snackBar.open('Giocatori modificati', null, {
        duration: 3000
      });
    },
      err => this.sharedService.getUnprocessableEntityErrors(this.membersForm, err)
    );
  }
}
