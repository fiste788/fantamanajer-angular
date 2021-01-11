import { Area } from './area.model';
import { Role } from './role.model';

export class Module {
  public key: string;
  public label: string;
  public areas: Array<Area>;

  constructor(key: string, roles: Map<number, Role>) {
    if (key) {
      this.key = key;
      this.label = key.substring(key.indexOf('-') + 1);
      const mod = key.split('-')
        .map(c => +c);
      this.areas = Array.from(roles.entries())
        // eslint-disable-next-line
        .reduce((array, [_, role], index) => {
          array.push({
            fromIndex: this.getIndex(array),
            options: [],
            role,
            toIndex: mod[index],
          });

          return array;
        }, new Array<Area>());
    }
  }

  public getIndex(previous: Array<Area>): number {
    return previous.reduce((p, v) => p + v.toIndex, 0);
  }
}
