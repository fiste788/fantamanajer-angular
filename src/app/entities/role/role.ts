import { Member } from '../member/member';

export class Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant: string;
  best_players: Member[];

  constructor(id: number, singolar: string) {
    this.id = id;
    this.singolar = singolar;
  }
}
