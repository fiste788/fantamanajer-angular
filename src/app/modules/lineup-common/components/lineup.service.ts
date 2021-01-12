import { EventEmitter, Injectable } from '@angular/core';

import { RoleService } from '@data/services';
import { Disposition, Lineup, Member, MemberOption, Module, Role } from '@data/types';

@Injectable()
export class LineupService {
  public lineup: Lineup;

  public benchOptions: Map<Role, Array<MemberOption>> = new Map<Role, Array<MemberOption>>();
  public membersById: Map<number, Member>;
  public captains: Map<string, 'captain_id' | 'vcaptain_id' | 'vvcaptain_id'> = new Map([
    ['C', 'captain_id'], ['VC', 'vcaptain_id'], ['VVC', 'vvcaptain_id'],
  ]);
  public modules: Array<Module>;
  public selectedModule: Module;
  public benchs: Array<number> = Array(7)
    .fill(7)
    .map((_, i) => i + 11);
  public captainables: Array<MemberOption>;
  public selectionChange: EventEmitter<Member | null> = new EventEmitter<Member | null>();
  public membersByRole: Map<Role, Array<Member>>;

  constructor(
    private readonly roleService: RoleService,
  ) { }

  public loadLineup(lineup: Lineup): void {
    lineup.team_id = lineup.team_id || lineup.team.id;
    this.lineup = lineup;
    this.membersById = lineup.team.members.reduce((m, v) => m.set(v.id, v), new Map<number, Member>());
    this.membersByRole = this.roleService.groupMembersByRole(lineup.team.members);
    this.lineup.dispositions = this.loadDispositions();
    this.loadModules();
    this.captainSelectionChange();
    this.benchOptions = Array.from(this.membersByRole.entries())
      .reduce((m, [k, v]) => m.set(k, v.map(member => ({ member, disabled: false }))),
        new Map<Role, Array<MemberOption>>());
    this.reloadBenchwarmerState();
  }

  public moduleChange(): void {
    this.lineup.module = this.selectedModule.key;
  }

  public memberSelectionChange(role: Role, member?: Member | null): void {
    this.reloadBenchwarmerState();
    if (['P', 'D'].includes(role.abbreviation)) {
      this.captainSelectionChange();
    }
    if (member !== undefined && member !== null) {
      this.removeBenchwarmer(member);
    }
    this.selectionChange.emit(member);
  }

  public benchwarmerSelectionChange(member?: Member | null): void {
    this.selectionChange.emit(member);
  }

  public captainSelectionChange(): void {
    this.captainables = this.getCapitanables();
  }

  public getLineup(): Lineup {
    // eslint-disable-next-line no-null/no-null
    this.lineup.dispositions.forEach(value => value.member_id = value.member?.id ?? null);

    return this.lineup;
  }

  private loadModules(): void {
    this.modules = this.lineup.modules.map(mod => new Module(mod, this.roleService.list()));
    const module = this.modules.find(e => e.key === this.lineup.module);
    if (module) {
      this.selectedModule = module;
      this.moduleChange();
    }
  }

  private loadDispositions(): Array<Disposition> {
    const dispositions = this.lineup.dispositions.reduce((p, d) => p.set(d.position - 1, d), new Map<number, Disposition>());

    return Array<Disposition>(18)
      .fill(new Disposition())
      .map((disp: Disposition, i) => {
        disp.position = i + 1;

        return dispositions.get(i) || { ...disp };
      })
      .map((disp) => {
        if (disp.member_id !== null) {
          // eslint-disable-next-line no-null/no-null
          disp.member = this.membersById.get(disp.member_id ?? 0) ?? null;
        }

        return disp;
      });
  }

  private reloadBenchwarmerState(): void {
    this.benchOptions.forEach((v) => {
      v.forEach((o) => {
        o.disabled = this.isRegular(o.member);
      });
    });
  }

  private removeBenchwarmer(member: Member): void {
    this.lineup.dispositions
      .filter(element => element.position > 11)
      .filter(element => element.member?.id === member.id)
      .forEach((element) => {
        // eslint-disable-next-line no-null/no-null
        element.member = null;
        // eslint-disable-next-line no-null/no-null
        element.member_id = null;
      });
  }

  private isRegular(member: Member): boolean {
    return this.getRegulars()
      .map(memb => memb.id)
      .includes(member.id);
  }

  private isCaptainAlreadySelected(member: Member): boolean {
    return [this.lineup.captain_id, this.lineup.vcaptain_id, this.lineup.vvcaptain_id].includes(member.id);
  }

  private getCapitanables(): Array<MemberOption> {
    return this.getRegulars()
      .filter(member => ['P', 'D'].includes(member.role.abbreviation))
      .map(member => ({ disabled: this.isCaptainAlreadySelected(member), member }));
  }

  private getRegulars(): Array<Member> {
    return this.lineup.dispositions
      .filter(disp => disp.position <= 11)
      .map(disp => disp.member)
      .filter((member): member is Member => member !== null);
  }
}
