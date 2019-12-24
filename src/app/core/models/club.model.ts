import { Member } from './';

export class Club {
  id: number;
  name: string;
  partitive: string;
  determinant: string;
  members: Member[];
  photo_url: string | null;
  background_url: {} | null;
}
