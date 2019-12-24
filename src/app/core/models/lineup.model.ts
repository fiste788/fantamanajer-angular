import { Member } from './member.model';
import { Matchday } from './matchday.model';
import { Team } from './team.model';
import { Module } from './module.model';
import { Disposition } from './disposition.model';
import { Role } from './role.model';

export class Lineup {
  id: number;
  module: string;
  jolly: boolean;
  captain_id: number | null;
  vcaptain_id: number | null;
  vvcaptain_id: number | null;
  matchday_id: number;
  team_id: number;
  captain: Member | null;
  vcaptain: Member | null;
  vvcaptain: Member | null;
  matchday: Matchday;
  team: Team;
  dispositions: Disposition[] = [];
  modules: string[];
  module_object?: Module;
  modified_at: Date | null;
  created_at: Date;

  constructor(roles: Map<number, Role>) {
    this.module_object = new Module(this.module, roles);
  }

}
