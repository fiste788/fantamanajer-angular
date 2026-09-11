import type { Member } from './member.interface';

export interface Club {
  background_url: Record<string, string> | null;
  determinant: string;
  id: number;
  members: Member[];
  name: string;
  partitive: string;
  photo_url: string | null;
}
