import { Disposition } from './disposition.model';
import { Matchday } from './matchday.model';
import { Member } from './member.model';
import { Team } from './team.model';

// tslint:disable: variable-name naming-convention
export class Lineup {
  public id: number;
  public module: string;
  public modules: Array<string>;
  public jolly: boolean;
  public captain_id: number | null;
  public vcaptain_id: number | null;
  public vvcaptain_id: number | null;
  public matchday_id: number;
  public team_id: number;
  public captain: Member | null;
  public vcaptain: Member | null;
  public vvcaptain: Member | null;
  public matchday: Matchday;
  public team: Team;
  public dispositions: Array<Disposition> = [];
  public modified_at: Date | null;
  public created_at: Date;
}
