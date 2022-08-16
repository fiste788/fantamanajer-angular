import { EventEmitter, Injectable } from '@angular/core';

import { flatGroupBy } from '@app/functions';
import { RoleService } from '@data/services';
import { Disposition, EmptyLineup, Member, MemberOption, Module, Role } from '@data/types';
import { environment } from '@env';

@Injectable()
export class LineupService {
  public lineup!: EmptyLineup;

  public benchOptions: Map<Role, Array<MemberOption>> = new Map<Role, Array<MemberOption>>();
  public membersById?: Map<number, Member>;
  public captains = new Map<string, 'captain_id' | 'vcaptain_id' | 'vvcaptain_id'>([
    ['C', 'captain_id'],
    ['VC', 'vcaptain_id'],
    ['VVC', 'vvcaptain_id'],
  ]);

  public modules?: Array<Module>;
  public selectedModule?: Module;
  public benchs?: Array<number>;
  public captainables?: Array<MemberOption>;
  public membersByRole?: Map<Role, Array<Member>>;
  public selectionChange: EventEmitter<Member | null> = new EventEmitter<Member | null>();

  constructor(private readonly roleService: RoleService) {}

  public loadLineup(
    lineup: EmptyLineup,
    benchs: number = environment.benchwarmersCount,
  ): EmptyLineup {
    lineup.team_id = lineup.team_id ?? lineup.team.id;
    this.benchs = Array.from({ length: benchs })
      .fill(benchs)
      .map((_, i) => i + 11);

    this.membersById = flatGroupBy(lineup.team.members || [], ({ id }) => id);
    this.membersByRole = this.roleService.groupMembersByRole(lineup.team.members || []);
    this.lineup = lineup;
    this.lineup.dispositions = this.loadDispositions(lineup);
    this.loadModules();
    this.captainSelectionChange();
    this.benchOptions = [...this.membersByRole.entries()].reduce(
      (m, [k, v]) =>
        m.set(
          k,
          v.map((member) => ({ member, disabled: false })),
        ),
      new Map<Role, Array<MemberOption>>(),
    );
    this.reloadBenchwarmerState();

    return this.lineup;
  }

  public moduleChange(): void {
    this.lineup.module = this.selectedModule?.key;
  }

  public memberSelectionChange(role: Role, member?: Member | null): void {
    this.reloadBenchwarmerState();
    if (['P', 'D'].includes(role.abbreviation)) {
      this.captainSelectionChange();
    }
    if (member) {
      this.removeBenchwarmer(member);
    }
    this.selectionChange.emit(member);
  }

  public benchwarmerSelectionChange(member?: Member | undefined): void {
    this.selectionChange.emit(member);
  }

  public captainSelectionChange(): void {
    this.captainables = this.getCapitanables();
  }

  public getLineup(): EmptyLineup {
    for (const value of this.lineup.dispositions) value.member_id = value.member?.id ?? null;

    return this.lineup;
  }

  private loadModules(): void {
    this.modules = this.lineup.modules.map((mod) => new Module(mod, this.roleService.list()));
    const module = this.modules.find((e) => e.key === this.lineup.module);
    this.selectedModule = module ?? this.modules[0];
    this.moduleChange();
  }

  private loadDispositions(lineup: EmptyLineup): Array<Disposition> {
    const dispositions = flatGroupBy(lineup.dispositions, ({ position }) => position - 1);
    const length = 11 + (this.benchs?.length ?? environment.benchwarmersCount);

    return Array.from<Disposition>({
      length,
    }).map((_, i) => {
      const disp = dispositions.get(i) ?? this.createEmptyDisposition(i);
      disp.member = this.membersById?.get(disp.member_id ?? 0) ?? null;

      return disp;
    });
  }

  private createEmptyDisposition(position: number): Disposition {
    return {
      position: position + 1,
    } as Disposition;
  }

  private reloadBenchwarmerState(): void {
    for (const o of [...this.benchOptions.values()].flat()) {
      o.disabled = this.isRegular(o.member);
    }
  }

  private removeBenchwarmer(member: Member): void {
    const dispositions = this.lineup.dispositions.filter(
      (element) => element.position > 11 && element.member?.id === member.id,
    );
    for (const element of dispositions) {
      element.member = null;
      element.member_id = null;
    }
  }

  private isRegular(member: Member): boolean {
    return this.getRegulars()
      .map((memb) => memb.id)
      .includes(member.id);
  }

  private isCaptainAlreadySelected(member: Member): boolean {
    return [this.lineup.captain_id, this.lineup.vcaptain_id, this.lineup.vvcaptain_id].includes(
      member.id,
    );
  }

  private getCapitanables(): Array<MemberOption> {
    return this.getRegulars()
      .filter((member) => ['P', 'D'].includes(member.role.abbreviation))
      .map((member) => ({ disabled: this.isCaptainAlreadySelected(member), member }));
  }

  private getRegulars(): Array<Member> {
    return this.lineup.dispositions
      .filter((disp) => disp.position <= 11)
      .map((disp) => disp.member)
      .filter((member): member is Member => member !== null);
  }
}
