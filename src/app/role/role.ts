export class Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant: string;

  constructor(id: number, singolar: string) {
    this.id = id;
    this.singolar = singolar;
  }
}
