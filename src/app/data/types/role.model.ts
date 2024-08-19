import { Member } from './member.model';

export interface Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant?: string;
  best_players?: Array<Member>;
  count: number;
}
