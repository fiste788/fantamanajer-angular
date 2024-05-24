import { Member } from '@data/types';

export interface BestPlayer {
  role: string;
  first: Member;
  others: Array<Member>;
}
