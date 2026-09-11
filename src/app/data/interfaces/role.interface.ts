import type { Member } from './member.interface';

export interface Role {
  abbreviation: string;
  best_players?: Member[];
  count: number;
  determinant?: string;
  id: number;
  plural: string;
  singular: string;
}
