import { Injectable } from '@angular/core';

import { groupBy } from '@app/functions';

import { Member, Module, Role } from '../types';

@Injectable({ providedIn: 'root' })
export class RoleService {
  readonly #roles = [
    { id: 1, singolar: 'Portiere', count: 3, abbreviation: 'P', plural: 'Portieri' },
    { id: 2, singolar: 'Difensore', count: 8, abbreviation: 'D', plural: 'Difensori' },
    { id: 3, singolar: 'Centrocampista', count: 8, abbreviation: 'C', plural: 'Centrocampisti' },
    { id: 4, singolar: 'Attaccante', count: 6, abbreviation: 'A', plural: 'Attaccanti' },
  ];

  public groupMembersByRole(members: Array<Member>): Map<Role, Array<Member>> {
    return groupBy(members, ({ role_id }) => this.get(role_id));
  }

  public list(): Array<Role> {
    return this.#roles;
  }

  public get(role_id?: number): Role {
    return this.#roles.find((r) => r.id === role_id)!;
  }

  public totalMembers(): number {
    return this.#roles.reduce((acc, c) => acc + c.count, 0);
  }

  public getModuleKey(): string {
    return this.#roles.map((r) => r.count).join('-');
  }

  public getModule(): Module {
    return new Module(this.getModuleKey(), this.#roles);
  }
}
