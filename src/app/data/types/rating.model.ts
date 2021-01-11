import { Matchday, Member } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class Rating {
  public id: number;
  public valued: boolean;
  public points: number;
  public points_no_bonus: number;
  public rating: number;
  public goals: number;
  public goals_against: number;
  public goals_victory: number;
  public goals_tie: number;
  public assist: number;
  public yellow_card: boolean;
  public red_card: boolean;
  public penalities_scored: number;
  public penalities_taken: number;
  public present: boolean;
  public regular: boolean;
  public quotation: number;
  public member_id: number;
  public matchday_id: number;
  public member: Member;
  public matchday: Matchday;
}
