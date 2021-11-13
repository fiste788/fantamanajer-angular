import { Member } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Role {
  id: number;
  singolar: string;
  plural: string;
  abbreviation: string;
  determinant?: string;
  best_players?: Array<Member>;
  count: number;
}
