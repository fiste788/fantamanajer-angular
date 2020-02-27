import { Member } from './';

// tslint:disable: variable-name
export class Player {
  id: number;
  name: string | null;
  surname: string;
  members: Array<Member>;
  full_name: string;
  photo_url: string | null;
}
