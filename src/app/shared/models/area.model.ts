import { MemberOption } from './member-option.model';
import { Role } from './role.model';

export interface Area {
  fromIndex: number;
  options: Array<MemberOption>;
  role: Role;
  toIndex: number;
}
