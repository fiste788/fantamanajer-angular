import { Member } from '../member/member';

export class Club {
  id: number;
  name: string;
  partitive: string;
  determinant: string;
  members: Member[];
  photo_url: string;
  background_url: string;
}
