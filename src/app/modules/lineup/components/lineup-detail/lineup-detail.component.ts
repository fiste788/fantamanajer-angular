import { animate, style, transition, trigger } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { LineupService, RoleService } from '@app/core/http';
import { Disposition, Lineup, Member, Module, Role } from '@app/shared/models';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  styleUrls: ['./lineup-detail.component.scss'],
  animations: [
    // transition(':leave', animateChild()),
    trigger('items', [
      transition(':enter', [
        style({ flex: 0.00001 }),  // initial
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
  @ViewChild(NgForm) lineupForm: NgForm;

  @Input() lineup: Lineup;
  @Input() disabled = false;
  membersByRole: Map<Role, Array<Member>>;
  membersById: Map<number, Member> = new Map<number, Member>();
  captains: Map<string, string> = new Map<string, string>();
  modules: Array<Module>;
  benchs: Array<number>;
  isRegularCallback: () => boolean;
  isAlreadySelectedCallback: () => boolean;

  constructor(
    private readonly shared: SharedService,
    private readonly lineupService: LineupService,
    private readonly roleService: RoleService,
    private readonly cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.benchs = Array(7)
      .fill(7)
      .map((_, i) => i + 11);
    this.captains.set('C', 'captain');
    this.captains.set('VC', 'vcaptain');
    this.captains.set('VVC', 'vvcaptain');

    const lineup = this.lineup ?? ((!this.disabled) ? new Lineup(this.roleService.list()) : undefined);
    lineup.team_id = lineup.team_id || lineup.team.id;
    this.isRegularCallback = this.isRegular.bind(this, lineup);
    this.isAlreadySelectedCallback = this.isAlreadySelected.bind(this, lineup);
    if (lineup !== undefined && lineup.team.members !== undefined) {
      this.membersByRole = this.roleService.groupMembersByRole(lineup.team.members);
      lineup.team.members.forEach(member => this.membersById.set(member.id, member), this);
      if (!this.disabled) {
        this.lineupService.getLikelyLineup(lineup)
          .subscribe(members => {
            members.forEach(member => {
              const m = this.membersById.get(member.id);
              if (m) {
                m.likely_lineup = member.likely_lineup;
              }
            });
            this.cd.detectChanges();
          });
      }
      this.modules = lineup.modules.map(m => new Module(m, this.roleService.list()));
      if (lineup.module) {
        lineup.module_object = this.modules.find(e => e.key === lineup.module, this);
      }
      let i = 0;
      if (lineup.dispositions === undefined) {
        lineup.dispositions = [];
      }
      for (i = 0; i < 18; i++) {
        if (
          lineup.dispositions.length < i ||
          lineup.dispositions[i] === undefined
        ) {
          lineup.dispositions[i] = new Disposition();
          lineup.dispositions[i].position = i + 1;
        }
        if (lineup.dispositions[i].member_id !== null) {
          lineup.dispositions[i].member = this.membersById.get(lineup.dispositions[i].member_id ?? 0);
        }
      }
    }
  }

  getErrors(module: NgModel): string {
    return SharedService.getError(module);
  }

  getIndex(lineup: Lineup, role: Role, memberKey: number): number {
    let count = 0;
    let i = 0;
    if (lineup.module_object?.map) {
      const roleKeys = Array.from(lineup.module_object.map.keys());

      const index = roleKeys.indexOf(role);
      for (i = 0; i < index; i++) {
        count += Array.from(lineup.module_object.map.values())[i].length;
      }
    }

    return count + memberKey;
  }

  getCapitanables(lineup: Lineup): Array<Member> {
    const regulars = lineup.dispositions.slice(0, 11);
    const def = regulars.filter(element => element.member !== null
      && ['P', 'D'].find(a => this.membersById.get(element.member?.id ?? 0)?.role.abbreviation === a), this);

    return def.map(element => this.membersById.get(element.member?.id ?? 0))
      .filter((x): x is Member => x !== null);
  }

  putInLineup(lineup: Lineup, element: Member, i: number): void {
    if (!(lineup.dispositions.length < i) || lineup.dispositions[i] === undefined) {
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
        if (event.value && element.member?.id === event.value.id) {
          delete element.member;
          delete element.member_id;
        }
      });
  }

  getMemberByKeys(lineup: Lineup, role: Role, memberKey: number): Member | undefined {
    return this.membersById.get(lineup.dispositions[this.getIndex(lineup, role, memberKey)].member?.id ?? 0);
  }

  getMemberLabelByKeys(lineup: Lineup, role: Role, memberKey: number): string {
    return this.getMemberByKeys(lineup, role, memberKey)?.player.full_name ?? '';
  }

  isAlreadySelected(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  isBenchwarmer(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position > 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  isRegular(lineup: Lineup, member: Member): boolean {
    return lineup.dispositions
      .filter(element => element.position <= 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  isCaptainAlreadySelected(lineup: Lineup, member: Member): boolean {
    return (
      lineup.captain_id === member.id ||
      lineup.vcaptain_id === member.id ||
      lineup.vvcaptain_id === member.id
    );
  }

  descOrder = (a: KeyValue<number, Role>, b: KeyValue<number, Role>) =>
    (a.key < b.key) ? b.key : a.key;

  trackByRole(_: number, item: KeyValue<number, Role>): number {
    return item.key; // or item.id
  }

  trackBySelection(_: number, item: KeyValue<number, Role>): number {
    return item.key; // or item.id
  }

  trackByBench(_: number, item: number): number {
    return item; // or item.id
  }

  trackByMember(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
