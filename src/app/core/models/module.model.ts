import { Role } from './role.model';

export class Module {
  key: string;
  label: string;
  map?: Map<Role, number[]>;

  constructor(key: string, roles: Map<number, Role>) {
    if (key) {
      this.key = key;
      this.label = key.substring(key.indexOf('-') + 1);
      this.map = key.split('-').reduce((map: Map<Role, number[]>, num, index) => {
        const players = parseInt(num, 10);
        const role = roles.get(index + 1);
        return role ? map.set(role, Array(players).fill(players).map((_, i) => i)) : undefined;
      }, new Map<Role, number[]>());
    }
  }
}
