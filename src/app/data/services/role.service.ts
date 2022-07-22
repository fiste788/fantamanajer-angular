import { Injectable } from '@angular/core';

import { groupBy } from '@app/functions';

import { Member, Role } from '../types';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly roles: Map<number, Role> = new Map<number, Role>([
    [1, { id: 1, singolar: 'Portiere', count: 3, abbreviation: 'P', plural: 'Portieri' }],
    [2, { id: 2, singolar: 'Difensore', count: 8, abbreviation: 'D', plural: 'Difensori' }],
    [
      3,
      { id: 3, singolar: 'Centrocampista', count: 8, abbreviation: 'C', plural: 'Centrocampisti' },
    ],
    [4, { id: 4, singolar: 'Attaccante', count: 6, abbreviation: 'A', plural: 'Attaccanti' }],
  ]);

  public groupMembersByRole(members: Array<Member>): Map<Role, Array<Member>> {
    return groupBy(members, ({ role }) => role);
  }

  public getById(id: number): Role | undefined {
    return this.roles.get(id);
  }

  public list(): Map<number, Role> {
    return this.roles;
  }

  public totalMembers(): number {
    return [...this.roles.values()].reduce((acc, c) => acc + c.count, 0);
  }
}
