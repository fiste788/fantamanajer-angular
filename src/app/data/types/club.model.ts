import { Member } from './member.model';

export interface Club {
  id: number;
  name: string;
  partitive: string;
  determinant: string;
  members: Array<Member>;
  photo_url: string | null;
  background_url: Record<string, string> | null;
}
