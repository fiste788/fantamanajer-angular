import { EventEmitter, Injectable } from '@angular/core';

import { MatSelectChange } from '@angular/material/select';

import { RoleService } from '@app/http';
import { MemberOption } from '@modules/member-common/components/member-selection/member-selection.component';
import { Disposition, Lineup, Member, Module, Role } from '@shared/models';

export interface Area {
  role: Role;
  fromIndex: number;
  toIndex: number;
  options: Array<MemberOption>;
}

@Injectable()
export class LineupService {
  lineup: Lineup;
  areas: Array<Area>;
  benchOptions: Map<Role, Array<MemberOption>>;
  membersById: Map<number, Member>;
  captains: Map<string, string> = new Map<string, string>([
    ['C', 'captain'], ['VC', 'vcaptain'], ['VVC', 'vvcaptain']
  ]);
  modules: Array<Module>;
  benchs: Array<number> = Array(7)
    .fill(7)
    .map((_, i) => i + 11);
  captainables: Array<MemberOption>;
  selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  private membersByRole: Map<Role, Array<Member>>;

  constructor(
    private readonly roleService: RoleService
  ) { }

  loadLineup(lineup?: Lineup): void {
    if (lineup) {
      lineup.team_id = lineup.team_id || lineup.team.id;
      this.lineup = lineup;
      this.membersById = lineup.team.members.reduce((m, v) => m.set(v.id, v), new Map<number, Member>());
      this.membersByRole = this.roleService.groupMembersByRole(lineup.team.members);
      this.benchOptions = Array.from(this.membersByRole.entries())
        .reduce((m, [k, v]) => m.set(k, v.map(member => ({ member, disabled: this.isAlreadySelected(member) }))),
          new Map<Role, Array<MemberOption>>());
      this.loadDispositions();
      this.captainSelectionChange();
    }
  }

  changeModule(lineup: Lineup): void {
    if (lineup.module_object?.map) {
      this.areas = Array.from(lineup.module_object.map.entries())
        .map(([role, count]) => {
          const options = (this.membersByRole.get(role) ?? []).map(member => ({ member, disabled: this.isRegular(member) }));

          return { role, options, fromIndex: this.getIndex(role, 0), toIndex: count.length };
        });
    }
  }

  loadDispositions(): void {
    if (this.lineup.dispositions === undefined) {
      this.lineup.dispositions = [];
    }
    Array(18)
      .fill(0)
      .forEach((_, i) => {
        if (this.lineup.dispositions.length < i || this.lineup.dispositions[i] === undefined) {
          this.lineup.dispositions[i] = new Disposition();
          this.lineup.dispositions[i].position = i + 1;
        }
        if (this.lineup.dispositions[i].member_id !== null) {
          this.lineup.dispositions[i].member = this.membersById.get(this.lineup.dispositions[i].member_id ?? 0);
        }
      });
  }

  getIndex(role: Role, memberKey: number): number {
    if (this.lineup.module_object?.map) {
      return Array.from(this.lineup.module_object.map.entries())
        .filter(([r]) => r.id < role.id)
        .map(([_, v]) => v)
        .reduce((c, v) => c + v.length, memberKey);
    }

    return memberKey;
  }

  getCapitanables(): Array<MemberOption> {
    const regulars = this.lineup.dispositions.slice(0, 11);
    const def = regulars.filter(element => element.member !== null
      && ['P', 'D'].find(a => this.membersById.get(element.member?.id ?? 0)?.role.abbreviation === a), this);

    return def.map(element => this.membersById.get(element.member?.id ?? 0))
      .filter((x): x is Member => x !== null)
      .map(m => ({ disabled: this.isCaptainAlreadySelected(m), member: m }));
  }

  putInLineup(element: Member, i: number): void {
    if (!(this.lineup.dispositions.length < i) || this.lineup.dispositions[i] === undefined) {
      this.lineup.dispositions[i] = new Disposition();
    }
    this.lineup.dispositions[i].position = i;
    this.lineup.dispositions[i].member = element;
    // this.lineup.dispositions[i].member_id = element.id;
  }

  memberSelectionChange(event: MatSelectChange): void {
    this.removeBenchwarmer(event.value);
    this.captainSelectionChange();
    this.benchOptions.forEach(v => {
      v.forEach(o => {
        o.disabled = this.isAlreadySelected(o.member);
      });
    });
    this.selectionChange.emit(event);
  }

  benchwarmerSelectionChange(event: MatSelectChange): void {
    this.removeBenchwarmer(event.value);
    this.selectionChange.emit(event);
  }

  captainSelectionChange(): void {
    this.captainables = this.getCapitanables();
  }

  removeBenchwarmer(member?: Member): void {
    if (member) {
      this.lineup.dispositions
        .filter(element => element.position > 11)
        // .filter(element => event.value && element.member.id === event.value.id);
        .map(element => {
          if (element.member?.id === member.id) {
            delete element.member;
            delete element.member_id;
          }
        });
      this.areas.forEach(v => v.options.filter(o => o.member.club_id === member.club_id)
        .map(o => o.disabled = this.isRegular(o.member)));
    }
  }

  getMemberByKeys(role: Role, memberKey: number): Member | undefined {
    return this.membersById.get(this.lineup.dispositions[this.getIndex(role, memberKey)].member?.id ?? 0);
  }

  getMemberLabelByKeys(role: Role, memberKey: number): string {
    return this.getMemberByKeys(role, memberKey)?.player.full_name ?? '';
  }

  isAlreadySelected(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  isBenchwarmer(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position > 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  isRegular(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position <= 11 && element.member !== null)
      .map(element => element.member?.id)
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
