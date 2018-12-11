import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchdayService, AuthService } from './';
import { Matchday, Team, User, Championship } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public seasonEnded: boolean;
  public seasonStarted: boolean;
  public matchday: Matchday;
  public championship: Championship;
  public team: Team;
  public user: User;
  public teams: Team[];

  constructor(
    private auth: AuthService,
    private matchdayService: MatchdayService,
    private injector: Injector
  ) { }

  getCurrentMatchday(): Observable<void> {
    return this.matchdayService.getCurrentMatchday().pipe(map(this.setCurrentMatchday.bind(this)));
  }

  private setCurrentMatchday(matchday: Matchday): void {
    this.matchday = matchday;
    this.seasonEnded = matchday.number > 38;
    this.seasonStarted = matchday.number > 0;
  }

  initialize(): Promise<any> {
    this.auth.loggedUser.subscribe(this.setUser.bind(this));
    let observable = this.getCurrentMatchday();
    if (this.auth.loggedIn()) {
      observable = concat(observable, this.auth.getCurrentUser());
    }
    return observable.toPromise();
  }

  setUser(user?: User) {
    if (user) {
      this.user = user;
      this.loadTeams(user.teams);
    } else {
      this.team = null;
      this.getRouter().navigate(['/']);
    }
  }

  loadTeams(teams?: Team[]) {
    teams = teams || [];
    this.teams = teams;
    this.setCurrentTeam(this.teams[0]);
  }

  setCurrentTeam(team: Team): Promise<Team> {
    if (team) {
      this.team = team;
      this.championship = team.championship;
      if (this.championship.season_id !== this.matchday.season_id) {
        this.seasonStarted = false;
        this.seasonEnded = true;
      } else {
        this.setCurrentMatchday(this.matchday);
      }
      return Promise.resolve(team);
    }
    return null;
  }

  public getRouter(): Router {
    return this.injector.get(Router);
  }
}
