import { EventEmitter, inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@env';

import { flatGroupBy } from '@app/functions';
import type { Disposition, EmptyLineup, Member, MemberOption, Role } from '@data/interfaces';
import { RoleService } from '@data/services';

@Injectable()
export class LineupService {

  readonly #roleService = inject(RoleService);

  public benchOptions: Map<Role, MemberOption[]> = new Map<Role, MemberOption[]>();
  public benchs?: number[];
  public captainables?: MemberOption[];
  public captains = new Map<string, 'captain_id' | 'vcaptain_id' | 'vvcaptain_id'>([
    ['C', 'captain_id'],
    ['VC', 'vcaptain_id'],
    ['VVC', 'vvcaptain_id'],
  ]);
  public lineup!: EmptyLineup;
  public membersById?: Map<number, Member>;
  public membersByRole?: Map<Role, Member[]>;
  public modules?: string[];
  public selectionChange: EventEmitter<Partial<Member> | undefined> = new EventEmitter<Partial<Member> | undefined>();

  public benchwarmerSelectionChange(member?: Partial<Member>): void {
    this.selectionChange.emit(member);
  }

  public captainSelectionChange(): void {
    this.captainables = this.#getCapitanables();
  }

  public getLineup(): EmptyLineup {
    for (const value of this.lineup.dispositions) value.member_id = value.member?.id ?? null;

    return this.lineup;
  }

  public loadLineup(lineup: EmptyLineup, benchs: number = ENVIRONMENT.benchwarmersCount): EmptyLineup {
    lineup.team_id ??= lineup.team.id;
    this.benchs = Array.from({ length: benchs }, () => benchs).map((_, index) => index + 11);

    this.membersById = flatGroupBy(lineup.team.members ?? [], ({ id }) => id);
    this.membersByRole = this.#roleService.groupMembersByRole(lineup.team.members ?? []);
    this.lineup = lineup;
    this.lineup.dispositions = this.#loadDispositions(lineup);
    this.#loadModules();
    this.captainSelectionChange();
    // eslint-disable-next-line unicorn/no-array-reduce
    this.benchOptions = [...this.membersByRole].reduce(
      (m, [k, v]) => m.set(
        k,
        v.map(member => ({ disabled: false, member })),
      ),
      new Map<Role, MemberOption[]>(),
    );
    this.#reloadBenchwarmerState();

    return this.lineup;
  }

  public memberSelectionChange(role: Role, member?: Partial<Member>): void {
    this.#reloadBenchwarmerState();
    if (['D', 'P'].includes(role.abbreviation)) {
      this.captainSelectionChange();
    }

    if (member) {
      this.#removeBenchwarmer(member);
    }
    this.selectionChange.emit(member);
  }

  #createEmptyDisposition(position: number): Disposition {
    return {
      position: position + 1,
    } as Disposition;
  }

  #getCapitanables(): MemberOption[] {
    return this.#getRegulars()
      .filter(member => ['D', 'P'].includes(member.role.abbreviation))
      .map(member => ({ disabled: this.#isCaptainAlreadySelected(member), member }));
  }

  #getRegulars(): Member[] {
    return this.lineup.dispositions
      .filter(disp => disp.position <= 11)
      .map(disp => disp.member)
      .filter((member): member is Member => member !== undefined);
  }

  #isCaptainAlreadySelected(member: Member): boolean {
    return [this.lineup.captain_id, this.lineup.vcaptain_id, this.lineup.vvcaptain_id].includes(member.id);
  }

  #isRegular(member: Member): boolean {
    return this.#getRegulars()
      .map(memb => memb.id)
      .includes(member.id);
  }

  #loadDispositions(lineup: EmptyLineup): Disposition[] {
    const dispositions = flatGroupBy(lineup.dispositions, ({ position }) => position - 1);
    const length = 11 + (this.benchs?.length ?? ENVIRONMENT.benchwarmersCount);

    return Array.from<Disposition>({
      length,
    }).map((_, index) => {
      const disp = dispositions.get(index) ?? this.#createEmptyDisposition(index);
      disp.member = this.membersById?.get(disp.member_id ?? 0) ?? undefined;

      return disp;
    });
  }

  #loadModules(): void {
    this.modules = this.lineup.modules;
    this.lineup.module ??= this.modules[0];
  }

  #reloadBenchwarmerState(): void {
    for (const o of [...this.benchOptions.values()].flat()) {
      o.disabled = this.#isRegular(o.member);
    }
  }

  #removeBenchwarmer(member: Partial<Member>): void {
    const dispositions = this.lineup.dispositions.filter(element => element.position > 11 && element.member?.id === member.id);

    for (const element of dispositions) {
      element.member = undefined;
      element.member_id = null;
    }
  }

}
