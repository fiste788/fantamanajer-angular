import { Member } from './member.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Club {
  id: number;
  name: string;
  partitive: string;
  determinant: string;
  members: Array<Member>;
  photo_url: string | null;
  background_url: Record<string, string> | null;
}
