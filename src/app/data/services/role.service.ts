import { Injectable } from '@angular/core';

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

  public groupMembersByRole(data: Array<Member>): Map<Role, Array<Member>> {
    return data.reduce((map: Map<Role, Array<Member>>, item) => {
      const role = this.roles.get(item.role_id);
      if (role) {
        map.set(role, [...(map.get(role) ?? []), item]);
      }

      return map;
    }, new Map());
  }

  public getById(id: number): Role | undefined {
    return this.roles.get(id);
  }

  public list(): Map<number, Role> {
    return this.roles;
  }

  public totalMembers(): number {
    let total = 0;
    this.roles.forEach((r) => (total += r.count));

    return total;
  }
}
