import { EventEmitter, Injectable } from '@angular/core';

import { MatSelectChange } from '@angular/material/select';

import { RoleService } from '@app/http';
import { Disposition, Lineup, Member, MemberOption, Module, Role } from '@shared/models';

export interface Area {
  role: Role;
  fromIndex: number;
  toIndex: number;
  options: Array<MemberOption>;
}

@Injectable()
export class LineupService {
  lineup: Lineup;

  benchOptions: Map<Role, Array<MemberOption>>;
  membersById: Map<number, Member>;
  captains: Map<string, string> = new Map<string, string>([
    ['C', 'captain'], ['VC', 'vcaptain'], ['VVC', 'vvcaptain']
  ]);
  modules: Array<Module>;
  selectedModule: Module;
  benchs: Array<number> = Array(7)
    .fill(7)
    .map((_, i) => i + 11);
  captainables: Array<MemberOption>;
  selectionChange: EventEmitter<Member> = new EventEmitter<Member>();
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
      this.loadDispositions();
      this.loadModules();
      this.captainSelectionChange();
      this.benchOptions = Array.from(this.membersByRole.entries())
        .reduce((m, [k, v]) => m.set(k, v.map(member => ({ member, disabled: false }))),
          new Map<Role, Array<MemberOption>>());
      this.reloadBenchwarmerState();
    }
  }

  moduleChange(): void {
    this.selectedModule.areas.forEach(area => (
      area.options = (this.membersByRole.get(area.role) ?? []).map(member => ({ member, disabled: this.isRegular(member) }))
    ));
    this.lineup.module = this.selectedModule.key;
  }

  memberSelectionChange(role: Role, member?: Member): void {
    this.reloadRegularState(role.id);
    this.reloadBenchwarmerState();
    if (member) {
      this.removeBenchwarmer(member);
    }
    if (['P', 'D'].includes(role.abbreviation)) {
      this.captainSelectionChange();
    }
    this.selectionChange.emit(member);
  }

  benchwarmerSelectionChange(member?: Member): void {
    if (member) {
      // this.removeBenchwarmer(member);
    }
    this.selectionChange.emit(member);
  }

  captainSelectionChange(): void {
    this.captainables = this.getCapitanables();
  }

  private loadModules(): void {
    this.modules = this.lineup.modules.map(mod => new Module(mod, this.roleService.list()));
    const module = this.modules.find(e => e.key === this.lineup.module);
    if (module) {
      this.selectedModule = module;
      this.moduleChange();
    }
  }

  private loadDispositions(): void {
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

  private reloadRegularState(roleId?: number): void {
    this.selectedModule.areas.filter(a => roleId === undefined || a.role.id === roleId)
      .forEach(v => v.options.map(o => o.disabled = this.isRegular(o.member)));
  }

  private reloadBenchwarmerState(): void {
    this.benchOptions.forEach(v => {
      v.forEach(o => {
        o.disabled = this.isRegular(o.member);
      });
    });
  }

  private removeBenchwarmer(member: Member): void {
    this.lineup.dispositions
      .filter(element => element.position > 11)
      .filter(element => element.member?.id === member.id)
      .forEach(element => {
        delete element.member;
        delete element.member_id;
      });
    this.reloadRegularState(member.role_id);
  }

  private isAlreadySelected(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private isRegular(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position <= 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private isCaptainAlreadySelected(member: Member): boolean {
    return [this.lineup.captain_id, this.lineup.vcaptain_id, this.lineup.vvcaptain_id].includes(member.id);
  }

  private getCapitanables(): Array<MemberOption> {
    return this.lineup.dispositions.slice(0, 11)
      .filter(e => e !== undefined && e !== null)
      .map(element => element.member as Member)
      .filter(m => ['P', 'D'].includes(m.role.abbreviation))
      .map(m => ({ disabled: this.isCaptainAlreadySelected(m), member: m }));
  }
}
