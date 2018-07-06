import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LineupService } from '../lineup.service';
import { SharedService } from 'app/shared/shared.service';
import { ApplicationService } from 'app/core/application.service';
import { Lineup } from '../lineup';
import { Disposition } from '../../disposition/disposition';
import { Member } from '../../member/member';
import { Role } from '../../role/role';
import { Module } from '../module';

@Component({
  selector: 'fm-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  styleUrls: ['./lineup-detail.component.scss']
})
export class LineupDetailComponent implements OnInit {
  membersByRole: Map<string, Member[]> = new Map<string, Member[]>();
  membersById: Map<number, Member> = new Map<number, Member>();
  captains: Map<string, string> = new Map<string, string>();
  lineup: Observable<Lineup>;
  editMode = false;
  teamId: number;
  modules: Module[] = [];
  roleKeys: string[] = [];
  captainsKeys: string[] = [];
  benchs: number[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private lineupService: LineupService,
    private route: ActivatedRoute,
    private shared: SharedService,
    public app: ApplicationService
  ) { }

  ngOnInit() {
    this.teamId = this.shared.getTeamId(this.route);
    this.editMode = this.app.team.id === this.teamId;
    this.benchs = Array(7)
      .fill(7)
      .map((x, i) => i + 11);
    this.captains.set('C', 'captain');
    this.captains.set('VC', 'vcaptain');
    this.captains.set('VVC', 'vvcaptain');
    this.captainsKeys = Array.from(this.captains.keys());
    this.lineup = this.lineupService.getLineup(this.teamId).pipe(map(lineup => {
      lineup = lineup || ((this.editMode) ? new Lineup() : undefined);
      if (lineup) {
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
        if (lineup.module) {
          lineup.module_object = this.modules.find(element => {
            return element.key === lineup.module;
          }, this);
          this.changeModule(lineup);
        }
        lineup.team_id = this.app.team.id;
        let i = 0;
        for (i = 0; i < 18; i++) {
          if (
            lineup.dispositions.length < i ||
            lineup.dispositions[i] == null
          ) {
            lineup.dispositions[i] = new Disposition();
            lineup.dispositions[i].position = i + 1;
          }
        }
      }
      return lineup || new Lineup;
    }));
  }

  getIndex(lineup: Lineup, key, key2): number {
    let count = 0;
    let i = 0;
    const index = this.roleKeys.indexOf(key);
    for (i = 0; i < index; i++) {
      count += Array.from(lineup.module_object.map.values())[i].length;
    }
    return count + key2;
  }

  changeModule(lineup: Lineup) {
    this.roleKeys = Array.from(lineup.module_object.map.keys());
  }

  getCapitanables(lineup: Lineup): Member[] {
    const regulars = lineup.dispositions.slice(0, 11);
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

  save(lineup: Lineup) {
    lineup.module = lineup.module_object.key;
    lineup.dispositions = lineup.dispositions.filter(
      value => value.member_id
    );
    if (lineup.id) {
      this.lineupService.update(lineup).subscribe(response => {
        this.snackBar.open('Formazione aggiornata', null, {
          duration: 3000
        });
      });
    } else {
      this.lineupService.create(lineup).subscribe(response => {
        this.snackBar.open('Formazione caricata', null, {
          duration: 3000
        });
        lineup.id = response.id;
      });
    }
  }

  putInLineup(lineup: Lineup, element, i) {
    if (!lineup.dispositions.length < i || lineup.dispositions[i] == null) {
      lineup.dispositions[i] = new Disposition();
    }
    lineup.dispositions[i].position = i;
    lineup.dispositions[i].member_id = element.id;
  }

  removeBenchwarmer(lineup: Lineup, event: any): void {
    lineup.dispositions
      .filter(element => element.position > 11)
      .map(element => {
        if (element.member_id === event.value) {
          element.member = null;
          element.member_id = null;
        }
      });
  }

  isAlreadySelected(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .map(element => element.member_id)
      .includes(member.id);
  }

  isBenchwarmer(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position > 11)
      .map(element => element.member_id)
      .includes(member.id);
  }

  isRegular(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position <= 11)
      .map(element => element.member_id)
      .includes(member.id);
  }

  isCaptainAlreadySelected(lineup: Lineup, member: Member): boolean {
    return (
      lineup.captain_id === member.id ||
      lineup.vcaptain_id === member.id ||
      lineup.vvcaptain_id === member.id
    );
  }
}
