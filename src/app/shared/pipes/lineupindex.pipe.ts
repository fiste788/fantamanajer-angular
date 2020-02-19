import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '@app/core/models';
import { RoleService } from '@app/core/services';

@Pipe({ name: 'li' })
export class LineupIndexPipe implements PipeTransform {

  roles: Map<number, Role> = new Map<number, Role>();

  constructor(
    private readonly rolesService: RoleService
  ) {
    this.roles = this.rolesService.list();
  }

  transform(key: Role, key2: number): number {
    let count = 0;
    let i = 0;
    const keys = Array.from(this.roles.keys());
    const index = keys.indexOf(key.id);
    for (i = 0; i < index; i++) {
      const l = Array.from(this.roles.values());
      if (l !== undefined) {
        count += l[i]?.count ?? 0;
      }
    }

    return count + key2;
  }
}
