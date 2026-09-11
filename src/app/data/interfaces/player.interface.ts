import type { Member } from './member.interface';

export interface Player {
  full_name: string;
  id: number;
  members: Member[];
  name: string | null;
  photo_url: string | null;
  surname: string;
}
