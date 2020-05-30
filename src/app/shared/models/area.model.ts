import { MemberOption } from './member-option.model';
import { Role } from './role.model';

export interface Area {
  role: Role;
  fromIndex: number;
  toIndex: number;
  options: Array<MemberOption>;
}
