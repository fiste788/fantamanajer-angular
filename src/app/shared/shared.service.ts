import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatchdayService } from '../matchday/matchday.service';
import { Matchday } from '../matchday/matchday';
import { Team } from '../team/team';
import { Championship } from '../championship/championship';

@Injectable()
export class SharedService {
  private currentSeason: number;
  public currentMatchday: Matchday;
  public currentChampionship: Championship;
  public currentTeam: Team;
  public teams: Team[];
  public tabs: any[] = [];
  public pageTitle: String = 'FantaManajer';

  constructor(private matchdayService: MatchdayService) {}

  getCurrentMatchday() {
    this.matchdayService.getCurrentMatchday().subscribe(matchday => {
      this.currentMatchday = matchday;
      this.currentSeason = this.currentMatchday.season_id;
    });
  }

  initialize() {
    this.getCurrentMatchday();
    this.loadTeams();
  }

  loadTeams(teams?) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    teams = teams || (user ? user.teams : []);
    this.teams = teams;
    this.setCurrentTeam(this.teams[0]);
  }

  setCurrentTeam(team) {
    if (team) {
      this.currentTeam = team;
      this.currentChampionship = team.championship;
    }
  }
}
