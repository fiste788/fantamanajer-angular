import { Injectable } from '@angular/core';

import { groupBy } from '@app/functions';

import { Member, Role } from '../types';

@Injectable({ providedIn: 'root' })
export class RoleService {
  // Modifica suggerita per la nomenclatura delle proprietà nell'array
  readonly #roles: Array<Role> = [
    // Tipizzazione esplicita per chiarezza
    { id: 1, singular: 'Portiere', count: 3, abbreviation: 'P', plural: 'Portieri' },
    { id: 2, singular: 'Difensore', count: 8, abbreviation: 'D', plural: 'Difensori' },
    { id: 3, singular: 'Centrocampista', count: 8, abbreviation: 'C', plural: 'Centrocampisti' },
    { id: 4, singular: 'Attaccante', count: 6, abbreviation: 'A', plural: 'Attaccanti' },
  ];

  // Modifica suggerita per la nomenclatura del parametro
  public groupMembersByRole(members: Array<Member>): Map<Role, Array<Member>> {
    return groupBy(members, ({ role_id }) => this.getRoleById(role_id)); // Utilizzo del nome del metodo modificato
  }

  public list(): Array<Role> {
    return this.#roles;
  }

  public getRoleById(roleId: number): Role {
    // Modifica suggerita per la nomenclatura del parametro
    return this.#roles.find((r) => r.id === roleId)!;
  }

  public totalMembers(): number {
    return this.#roles.reduce((acc, c) => acc + c.count, 0);
  }

  public getModuleKey(): string {
    return this.#roles.map((r) => r.count).join('-');
  }
}
