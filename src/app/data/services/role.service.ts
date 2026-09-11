import { Service } from '@angular/core';

import { groupBy } from '@app/functions';

import type { Member, Role } from '../interfaces';

@Service()
export class RoleService {

  // Modifica suggerita per la nomenclatura delle proprietà nell'array
  readonly #roles: Role[] = [
    // Tipizzazione esplicita per chiarezza
    { abbreviation: 'P', count: 3, id: 1, plural: 'Portieri', singular: 'Portiere' },
    { abbreviation: 'D', count: 8, id: 2, plural: 'Difensori', singular: 'Difensore' },
    { abbreviation: 'C', count: 8, id: 3, plural: 'Centrocampisti', singular: 'Centrocampista' },
    { abbreviation: 'A', count: 6, id: 4, plural: 'Attaccanti', singular: 'Attaccante' },
  ];

  public getModuleKey(): string {
    return this.#roles.map(r => r.count).join('-');
  }

  public getRoleById(roleId: number): Role {
    // Modifica suggerita per la nomenclatura del parametro
    return this.#roles.find(r => r.id === roleId)!;
  }

  // Modifica suggerita per la nomenclatura del parametro
  public groupMembersByRole(members: Member[]): Map<Role, Member[]> {
    return groupBy(members, ({ role_id }) => this.getRoleById(role_id)); // Utilizzo del nome del metodo modificato
  }

  public list(): Role[] {
    return this.#roles;
  }

  public totalMembers(): number {
    return this.#roles.reduce((accumulator, c) => accumulator + c.count, 0);
  }

}
