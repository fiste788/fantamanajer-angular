import { MemberOption } from './member-option.model';
import { Role } from './role.model';

// Modifica suggerita per la nomenclatura
export interface FormationArea {
  fromIndex: number;
  options: Array<MemberOption>;
  role: Role;
  toIndex: number;
}
