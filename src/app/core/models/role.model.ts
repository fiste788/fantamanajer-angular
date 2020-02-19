import { Member } from './';

export class Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant: string;
  best_players?: Array<Member>;
  count: number;

  constructor(id: number, singolar: string, count: number, abbreviation?: string, plural?: string) {
    this.id = id;
    this.singolar = singolar;
    this.abbreviation = abbreviation ?? '';
    this.plural = plural ?? '';
    this.count = count;
  }
}
