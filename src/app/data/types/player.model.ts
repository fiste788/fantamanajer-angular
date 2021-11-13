import { Member } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Player {
  id: number;
  name: string | null;
  surname: string;
  members: Array<Member>;
  full_name: string;
  photo_url: string | null;
}
