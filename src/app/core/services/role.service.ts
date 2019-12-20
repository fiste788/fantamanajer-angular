import { Injectable } from '@angular/core';
import { Role, Member } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private roles: Map<number, Role> = new Map<number, Role>([
    [1, new Role(1, 'Portiere', 'P', 'Portieri')],
    [2, new Role(2, 'Difensore', 'D', 'Difensori')],
    [3, new Role(3, 'Centrocampista', 'C', 'Centrocampisti')],
    [4, new Role(4, 'Attaccante', 'A', 'Attaccanti')],
  ]);

  groupMembersByRole(data: Member[]): Map<Role, Member[]> {
    return data.reduce((map: Map<Role, Member[]>, item) => {
      const role = this.roles.get(item.role_id);
      if (role) {
        map.set(role, ([...map.get(role) || [], item]));
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
}
