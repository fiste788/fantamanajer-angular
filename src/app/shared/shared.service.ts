import { Injectable } from '@angular/core';
import { MatchdayService } from '../matchday/matchday.service';
import { Matchday } from '../matchday/matchday';
import { Team } from '../team/team';
import { Championship } from '../championship/championship';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class SharedService {

  private currentSeason: number;
  public currentMatchday: Matchday;
  public currentChampionship: Championship;
  public currentTeam: Team;
  public teams: Team[];
  public tabs: any[];
  public pageTitle: String = 'FantaManajer';

  constructor(private matchdayService: MatchdayService,
    private snackbar: MdSnackBar) {
    this.tabs = [];
  }

  getCurrentMatchday() {
    this.matchdayService.getCurrentMatchday().then(matchday => {
      this.currentMatchday = matchday;
      this.currentSeason = this.currentMatchday.season_id;
    });
  }

  handleError(error: any): Promise<any> {
  if (error) {
      // const message = error.json().data.message;
      const message = error.message;
      console.error('An error occurred', message);
      this.snackbar.open('Internal server error', null, {
        duration: 3000
      });
      return Promise.reject(message);
    }
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
      console.log(team);
      this.currentChampionship = team.championship;
    }
  }

}
