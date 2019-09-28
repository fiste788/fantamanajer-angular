import { Member } from './';

export class Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant: string;
  best_players: Member[];

  constructor(id: number, singolar: string, abbreviation?: string, plural?: string) {
    this.id = id;
    this.singolar = singolar;
    this.abbreviation = abbreviation;
    this.plural = plural;
  }
}
