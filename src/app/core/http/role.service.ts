import { Injectable } from '@angular/core';

import { Member, Role } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly roles: Map<number, Role> = new Map<number, Role>([
    [1, new Role(1, 'Portiere', 3, 'P', 'Portieri')],
    [2, new Role(2, 'Difensore', 8, 'D', 'Difensori')],
    [3, new Role(3, 'Centrocampista', 8, 'C', 'Centrocampisti')],
    [4, new Role(4, 'Attaccante', 6, 'A', 'Attaccanti')]
  ]);

  groupMembersByRole(data: Array<Member>): Map<Role, Array<Member>> {
    return data.reduce((map: Map<Role, Array<Member>>, item) => {
      const role = this.roles.get(item.role_id);
      if (role) {
        map.set(role, ([...map.get(role) ?? [], item]));
      }

      return map;
    }, new Map());
  }

  getById(id: number): Role | undefined {
    return this.roles.get(id);
  }

  list(): Map<number, Role> {
    return this.roles;
  }

  totalMembers(): number {
    let total = 0;
    this.roles.forEach(r => total += r.count);

    return total;
  }
}
