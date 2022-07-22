import { Area } from './area.model';
import { Role } from './role.model';

export class Module {
  public label: string;
  public areas: Array<Area>;

  constructor(public key: string, roles: Map<number, Role>) {
    this.label = key.slice(Math.max(0, key.indexOf('-') + 1));
    const mod = key.split('-').map((c) => +c);

    // eslint-disable-next-line unicorn/no-array-reduce
    this.areas = [...roles.values()].reduce((array, role, index) => {
      array.push({
        fromIndex: this.getIndex(array),
        options: [],
        role,
        toIndex: mod[index] ?? 0,
      });

      return array;
    }, new Array<Area>());
  }

  public getIndex(previous: Array<Area>): number {
    return previous.reduce((p, v) => p + v.toIndex, 0);
  }
}
