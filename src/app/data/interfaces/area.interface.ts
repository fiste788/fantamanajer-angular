import type { MemberOption } from './member-option.interface';
import type { Role } from './role.interface';

// Modifica suggerita per la nomenclatura
export interface FormationArea {
  fromIndex: number;
  options: MemberOption[];
  role: Role;
  toIndex: number;
}
