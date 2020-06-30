import { IMemberOption } from './member-option.model';
import { Role } from './role.model';

export interface IArea {
  role: Role;
  fromIndex: number;
  toIndex: number;
  options: Array<IMemberOption>;
}
