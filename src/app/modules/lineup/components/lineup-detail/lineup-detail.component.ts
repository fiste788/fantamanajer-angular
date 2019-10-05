import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { LineupService, RoleService } from '@app/core/services';
import { Lineup, Disposition, Member, Module, Role } from '@app/core/models';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  styleUrls: ['./lineup-detail.component.scss'],
  animations: [
    // transition(':leave', animateChild()),
    trigger('items', [
      transition(':enter', [
        style({ flex: .00001 }),  // initial
        animate('500ms ease',
          style({ flex: 1 }))  // final
      ]),
      transition(':leave', [
        style({ flex: 1 }),
        animate('500ms ease',
          style({
            flex: 0.00001
          }))
      ])
    ])
  ]
})
export class LineupDetailComponent implements OnInit {
  @ViewChild(NgForm, { static: false }) lineupForm: NgForm;

  @Input() lineup: Lineup;
  @Input() disabled = false;
  membersByRole: Map<Role, Member[]>;
  membersById: Map<number, Member> = new Map<number, Member>();
  captains: Map<string, string> = new Map<string, string>();
  modules: Module[];
  benchs: number[];
  isRegularCallback: () => boolean;
  isAlreadySelectedCallback: () => boolean;

  constructor(
    public shared: SharedService,
    private lineupService: LineupService,
    private roleService: RoleService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.benchs = Array(7)
      .fill(7)
      .map((x, i) => i + 11);
    this.captains.set('C', 'captain');
    this.captains.set('VC', 'vcaptain');
    this.captains.set('VVC', 'vvcaptain');

    const lineup = this.lineup || ((!this.disabled) ? new Lineup(this.roleService.list()) : undefined);
    lineup.team_id = lineup.team_id || lineup.team.id;
    this.isRegularCallback = this.isRegular.bind(this, lineup);
    this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this, lineup);
    if (lineup) {
      this.membersByRole = this.roleService.groupMembersByRole(lineup.team.members);
      lineup.team.members.forEach((member) => this.membersById.set(member.id, member), this);
      if (!this.disabled) {
        this.lineupService.getLikelyLineup(lineup).subscribe(members => {
          members.forEach(member => this.membersById.get(member.id).likely_lineup = member.likely_lineup);
          this.cd.detectChanges();
        });
      }
      /*lineup.modules.forEach((module, index) => {
        this.modules.push(new Module(module));
      }, this);*/
      this.modules = lineup.modules.map(m => new Module(m, this.roleService.list()));
      if (lineup.module) {
        lineup.module_object = this.modules.find(e => e.key === lineup.module, this);
      }
      let i = 0;
      if (!lineup.dispositions) {
        lineup.dispositions = [];
      }
      for (i = 0; i < 18; i++) {
        if (
          lineup.dispositions.length < i ||
          lineup.dispositions[i] == null
        ) {
          lineup.dispositions[i] = new Disposition();
          lineup.dispositions[i].position = i + 1;
        }
        if (lineup.dispositions[i].member_id) {
          lineup.dispositions[i].member = this.membersById.get(lineup.dispositions[i].member_id);
        }
      }
    }

  }

  getIndex(lineup: Lineup, role: Role, memberKey: number): number {
    let count = 0;
    let i = 0;
    const roleKeys = Array.from(lineup.module_object.map.keys());
    const index = roleKeys.indexOf(role);
    for (i = 0; i < index; i++) {
      count += Array.from(lineup.module_object.map.values())[i].length;
    }
    return count + memberKey;
  }

  getCapitanables(lineup: Lineup): Member[] {
    const regulars = lineup.dispositions.slice(0, 11);
    const def = regulars.filter(element => element &&
      element.member && ['P', 'D'].find(a => this.membersById.get(element.member.id).role.abbreviation === a), this);
    return def.map(element => this.membersById.get(element.member.id), this);
  }

  putInLineup(lineup: Lineup, element: Member, i: number) {
    if (!(lineup.dispositions.length < i) || lineup.dispositions[i] == null) {
      lineup.dispositions[i] = new Disposition();
    }
    lineup.dispositions[i].position = i;
    lineup.dispositions[i].member = element;
    // lineup.dispositions[i].member_id = element.id;
  }

  removeBenchwarmer(lineup: Lineup, event: MatSelectChange): void {
    lineup.dispositions
      .filter(element => element.position > 11)
      // .filter(element => event.value && element.member.id === event.value.id);
      .map(element => {
        if (event.value && element.member && element.member.id === event.value.id) {
          delete element.member;
          element.member_id = null;
        }
      });
  }

  getMemberByKeys(lineup: Lineup, role: Role, memberKey: number) {
    return this.membersById.get(lineup.dispositions[this.getIndex(lineup, role, memberKey)].member.id);
  }

  getMemberLabelByKeys(lineup: Lineup, role: Role, memberKey: number) {
    return this.getMemberByKeys(lineup, role, memberKey).player.full_name;
  }

  isAlreadySelected(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.member != null)
      .map(element => element.member.id)
      .includes(member.id);
  }

  isBenchwarmer(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position > 11 && element.member)
      .map(element => element.member.id)
      .includes(member.id);
  }

  isRegular(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position <= 11 && element.member)
      .map(element => element.member.id)
      .includes(member.id);
  }

  isCaptainAlreadySelected(lineup: Lineup, member: Member): boolean {
    return (
      lineup.captain_id === member.id ||
      lineup.vcaptain_id === member.id ||
      lineup.vvcaptain_id === member.id
    );
  }

  descOrder = (a: any, b: any) => {
    if (a.key < b.key) {
      return b.key;
    }
  }

  trackByRole(index: number, item: any) {
    return item.key; // or item.id
  }

  trackBySelection(index: number, item: any) {
    return item.key; // or item.id
  }
}
