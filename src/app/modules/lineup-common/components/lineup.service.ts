import { EventEmitter, Injectable } from '@angular/core';

import { RoleService } from '@app/http';
import { Disposition, Lineup, Member, MemberOption, Module, Role } from '@shared/models';

@Injectable()
export class LineupService {
  lineup: Lineup;

  benchOptions: Map<Role, Array<MemberOption>>;
  membersById: Map<number, Member>;
  captains: Map<string, 'captain_id' | 'vcaptain_id' | 'vvcaptain_id'> = new Map([
    ['C', 'captain_id'], ['VC', 'vcaptain_id'], ['VVC', 'vvcaptain_id']
  ]);
  modules: Array<Module>;
  selectedModule: Module;
  benchs: Array<number> = Array(7)
    .fill(7)
    .map((_, i) => i + 11);
  captainables: Array<MemberOption>;
  selectionChange: EventEmitter<Member | null> = new EventEmitter<Member | null>();
  membersByRole: Map<Role, Array<Member>>;

  constructor(
    private readonly roleService: RoleService
  ) { }

  loadLineup(lineup: Lineup): void {
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

  moduleChange(): void {
    this.lineup.module = this.selectedModule.key;
  }

  memberSelectionChange(role: Role, member?: Member | null): void {
    this.reloadBenchwarmerState();
    if (['P', 'D'].includes(role.abbreviation)) {
      this.captainSelectionChange();
    }
    if (member !== undefined && member !== null) {
      this.removeBenchwarmer(member);
    }
    this.selectionChange.emit(member);
  }

  benchwarmerSelectionChange(member?: Member | null): void {
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
          const disp = new Disposition();
          disp.position = i + 1;
          this.lineup.dispositions[i] = disp;
        }
        if (this.lineup.dispositions[i].member_id !== null) {
          // tslint:disable-next-line: no-null-keyword
          this.lineup.dispositions[i].member = this.membersById.get(this.lineup.dispositions[i].member_id ?? 0) ?? null;
        }
      });
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
  }

  private isAlreadySelected(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.member !== null && element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private isRegular(member: Member): boolean {
    return this.lineup.dispositions
      .filter(element => element.position <= 11 && element.member !== null && element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private isCaptainAlreadySelected(member: Member): boolean {
    return [this.lineup.captain_id, this.lineup.vcaptain_id, this.lineup.vvcaptain_id].includes(member.id);
  }

  private getCapitanables(): Array<MemberOption> {
    return this.lineup.dispositions.slice(0, 11)
      .map(element => element.member)
      .filter(d => d !== undefined && d !== null)
      .filter((m: Member) => ['P', 'D'].includes(m.role.abbreviation))
      .map((m: Member) => ({ disabled: this.isCaptainAlreadySelected(m), member: m }));
  }
}
