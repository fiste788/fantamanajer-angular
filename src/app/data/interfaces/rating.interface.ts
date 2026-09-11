import type { Matchday } from './matchday.interface';
import type { Member } from './member.interface';

export interface Rating {
  assist: number;
  goals: number;
  goals_against: number;
  goals_tie: number;
  goals_victory: number;
  id: number;
  matchday: Matchday;
  matchday_id: number;
  member: Member;
  member_id: number;
  penalities_scored: number;
  penalities_taken: number;
  points: number;
  points_no_bonus: number;
  present: boolean;
  quotation: number;
  rating: number;
  red_card: boolean;
  regular: boolean;
  valued: boolean;
  yellow_card: boolean;
}
