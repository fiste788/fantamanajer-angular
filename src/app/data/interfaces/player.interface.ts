import { Member } from './member.model';

export interface Player {
  id: number;
  name: string | null;
  surname: string;
  members: Array<Member>;
  full_name: string;
  photo_url: string | null;
}
