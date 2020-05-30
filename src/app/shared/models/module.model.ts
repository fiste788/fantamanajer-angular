import { Area } from './area.model';
import { Role } from './role.model';

export class Module {
  key: string;
  label: string;
  areas: Array<Area>;

  constructor(key: string, roles: Map<number, Role>) {
    if (key) {
      this.key = key;
      this.label = key.substring(key.indexOf('-') + 1);
      const mod = key.split('-')
        .map(c => +c);
      this.areas = Array.from(roles.entries())
        .reduce((array, [_, role], index) => {
          array.push({
            role,
            fromIndex: this.getIndex(array),
            toIndex: mod[index],
            options: []
          });

          return array;
        }, new Array<Area>());
    }
  }

  getIndex(previous: Array<Area>): number {
    return previous.reduce((p, v) => p + v.toIndex, 0);
  }
}
