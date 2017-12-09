import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from '../module';
import { Member } from '../../member/member';
import { Lineup } from '../lineup';
import { Disposition } from '../../disposition/disposition';
import { Role } from '../../role/role';
import { LineupService } from '../lineup.service';
import { MatSnackBar } from '@angular/material';
import { SharedService } from '../../shared/shared.service';

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
  lineup: Lineup;
  roleKeys: string[] = [];
  captains = new Map<string, string>();
  captainsKeys: string[] = [];
  benchs: number[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private lineupService: LineupService,
    private route: ActivatedRoute,
    private shared: SharedService
  ) { }

  ngOnInit() {
    this.benchs = Array(7)
      .fill(7)
      .map((x, i) => i + 11);
    this.captains.set('C', 'captain');
    this.captains.set('VC', 'vcaptain');
    this.captains.set('VVC', 'vvcaptain');
    this.captainsKeys = Array.from(this.captains.keys());
    this.lineupService.getLineup(this.getTeamId()).subscribe(data => {
      data.members.forEach(function (element, index) {
        if (!this.membersByRole.has(element.role.abbreviation)) {
          this.membersByRole.set(element.role.abbreviation, []);
        }
        this.membersByRole.get(element.role.abbreviation).push(element);
        this.membersById.set(element.id, element);
      }, this);
      data.modules.forEach(function (element, index) {
        this.modules.push(new Module(element));
      }, this);
      this.lineup = data.lineup || new Lineup();
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
      /*if (this.lineup) {
        this.lineup.dispositions.forEach(function(element, i) {
          if (i < 11) {
            this.regulars.push(element.member);
          } else {
            this.notRegulars.push(element.member);
          }
        }, this)
      } else {
        this.lineup = new Lineup();
      }*/
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
    console.log(this.roleKeys);
    console.log(this.lineup.module_object.map.get(this.roleKeys[0]));
  }

  isAlreadySelected(member: Member): boolean {
    return this.lineup.dispositions
      .map(element => element.member_id)
      .includes(member.id);
    // return Object.keys(this.regulars).map(key => this.regulars[key]).includes(member)
    // return Object.values(this.regulars).includes(member);
  }

  isCaptainAlreadySelected(member: Member): boolean {
    return (
      this.lineup.captain_id === member.id ||
      this.lineup.vcaptain_id === member.id ||
      this.lineup.vvcaptain_id === member.id
    );
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

  getTeamId(): number {
    for (const x in this.route.snapshot.pathFromRoot) {
      if (this.route.pathFromRoot.hasOwnProperty(x)) {
        const current = this.route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }
}
