import { Member } from './';

// tslint:disable: variable-name
export class Club {
  id: number;
  name: string;
  partitive: string;
  determinant: string;
  members: Array<Member>;
  photo_url: string | null;
  background_url: {} | null;
}
