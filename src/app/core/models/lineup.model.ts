import { Member } from './member.model';
import { Matchday } from './matchday.model';
import { Team } from './team.model';
import { Module } from './module.model';
import { Disposition } from './disposition.model';

export class Lineup {
  id: number;
  module: string;
  jolly: boolean;
  captain_id: number;
  vcaptain_id: number;
  vvcaptain_id: number;
  matchday_id: number;
  team_id: number;
  captain: Member;
  vcaptain: Member;
  vvcaptain: Member;
  matchday: Matchday;
  team: Team;
  dispositions: Disposition[] = [];
  modules: string[];
  module_object: Module;
  modified_at: Date;
  created_at: Date;

  constructor() {
    this.module_object = new Module(this.module);
  }

}
