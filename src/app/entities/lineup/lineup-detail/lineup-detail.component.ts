import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from '../module';
import { Member } from '../../member/member';
import { Lineup } from '../lineup';
import { Disposition } from '../../disposition/disposition';
import { Role } from '../../role/role';
import { LineupService } from '../lineup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { SharedService } from 'app/shared/shared.service';
import { share } from 'rxjs/operators/share';

@Component({
  selector: 'fm-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  styleUrls: ['./lineup-detail.component.scss']
})
export class LineupDetailComponent implements OnInit {
  modules: Module[] = [];
  // module: Module;
  membersByRole: Map<string, Member[]> = new Map<string, Member[]>();
  membersById: Map<number, Member> = new Map<number, Member>();
  public lineup: Lineup;
  public lineupResponse: Observable<Lineup>;
  roleKeys: string[] = [];
  captains = new Map<string, string>();
  captainsKeys: string[] = [];
  benchs: number[] = [];
  teamId: number;
  editMode = false;

  constructor(
    public snackBar: MatSnackBar,
    private lineupService: LineupService,
    private route: ActivatedRoute,
    private shared: SharedService
  ) { }

  ngOnInit() {
    this.teamId = this.shared.getTeamId(this.route);
    this.editMode = this.shared.currentTeam.id === this.teamId;
    this.benchs = Array(7)
      .fill(7)
      .map((x, i) => i + 11);
    this.captains.set('C', 'captain');
    this.captains.set('VC', 'vcaptain');
    this.captains.set('VVC', 'vvcaptain');
    this.captainsKeys = Array.from(this.captains.keys());
    this.lineupResponse = this.lineupService.getLineup(this.teamId).pipe(share());
    this.lineupResponse.subscribe((lineup: Lineup) => {
      this.lineup = lineup || ((this.editMode) ? new Lineup() : undefined);
      lineup.team.members.forEach((member, index) => {
        if (!this.membersByRole.has(member.role.abbreviation)) {
          this.membersByRole.set(member.role.abbreviation, []);
        }
        this.membersByRole.get(member.role.abbreviation).push(member);
        this.membersById.set(member.id, member);
      }, this);
      lineup.modules.forEach((module, index) => {
        this.modules.push(new Module(module));
      }, this);
      if (this.lineup) {
        if (this.lineup.module) {
          this.lineup.module_object = this.modules.find(element => {
            return element.key === this.lineup.module;
          }, this);
          this.changeModule();
        }
        this.lineup.team_id = this.shared.currentTeam.id;
        this.lineup.matchday_id = this.shared.currentMatchday.id;
        let i = 0;
        for (i = 0; i < 18; i++) {
          if (
            this.lineup.dispositions.length < i ||
            this.lineup.dispositions[i] == null
          ) {
            this.lineup.dispositions[i] = new Disposition();
            this.lineup.dispositions[i].position = i + 1;
          }
        }
      }
    });
  }

  getIndex(key, key2): number {
    let count = 0;
    let i = 0;
    const index = this.roleKeys.indexOf(key);
    for (i = 0; i < index; i++) {
      count += Array.from(this.lineup.module_object.map.values())[i].length;
    }
    return count + key2;
  }

  changeModule() {
    this.roleKeys = Array.from(this.lineup.module_object.map.keys());
  }

  getCapitanables(): Member[] {
    const regulars = this.lineup.dispositions.slice(0, 11);
    const def = regulars.filter(function (element) {
      if (element && element.member_id) {
        return (
          this.membersById.get(element.member_id).role.abbreviation === 'P' ||
          this.membersById.get(element.member_id).role.abbreviation === 'D'
        );
      }
    }, this);
    return def.map(element => this.membersById.get(element.member_id), this);
  }

  save() {
    this.lineup.module = this.lineup.module_object.key;
    this.lineup.dispositions = this.lineup.dispositions.filter(
      value => value.member_id
    );
    if (this.lineup.id) {
      this.lineupService.update(this.lineup).subscribe(response => {
        this.snackBar.open('Formazione aggiornata', null, {
          duration: 3000
        });
      });
    } else {
      this.lineupService.create(this.lineup).subscribe(response => {
        this.snackBar.open('Formazione caricata', null, {
          duration: 3000
        });
        this.lineup.id = response.id;
      });
    }
  }

  putInLineup(element, i) {
    if (
      !this.lineup.dispositions.length < i ||
      this.lineup.dispositions[i] == null
    ) {
      this.lineup.dispositions[i] = new Disposition();
    }
    this.lineup.dispositions[i].position = i;
    this.lineup.dispositions[i].member_id = element.id;
  }

  removeBenchwarmer(event: any): void {
    this.lineup.dispositions
      .filter(element => element.position > 11)
      .map(element => {
        if (element.member_id === event.value) {
          element.member = null;
          element.member_id = null;
        }
      });
  }

  isAlreadySelected(member: Member): boolean {
    return this.lineup.dispositions
      .map(element => element.member_id)
      .includes(member.id);
  }

  isBenchwarmer(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position > 11)
      .map(element => element.member_id)
      .includes(member.id);
  }

  isRegular(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position <= 11)
      .map(element => element.member_id)
      .includes(member.id);
  }

  isCaptainAlreadySelected(member: Member): boolean {
    return (
      this.lineup.captain_id === member.id ||
      this.lineup.vcaptain_id === member.id ||
      this.lineup.vvcaptain_id === member.id
    );
  }
}
