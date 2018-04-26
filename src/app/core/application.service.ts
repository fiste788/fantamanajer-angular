import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatchdayService } from '../entities/matchday/matchday.service';
import { Matchday } from '../entities/matchday/matchday';
import { Team } from '../entities/team/team';
import { User } from '../user/user';
import { Championship } from '../entities/championship/championship';
import { AuthService } from 'app/shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { UserService } from 'app/user/user.service';
import { map } from 'rxjs/operators';
import { concat } from 'rxjs/observable/concat';
import { Season } from '../entities/season/season';

@Injectable()
export class ApplicationService {
  private season: Season;
  public matchday: Matchday;
  public championship: Championship;
  public team: Team;
  public user: User;
  public teams: Team[];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private matchdayService: MatchdayService
  ) { }

  getCurrentMatchday(): Observable<void> {
    return this.matchdayService.getCurrentMatchday().pipe(map(matchday => {
      this.matchday = matchday;
      this.season = this.matchday.season;
    }));
  }

  getCurrentUser(): Observable<void> {
    return this.userService.getCurrent().pipe(map(user => {
      this.auth.loggedUser.emit(user);
      this.setUser(user);
    }));
  }

  initialize(): Promise<any> {
    this.auth.loggedUser.subscribe(this.setUser.bind(this));
    if (this.auth.loggedIn()) {
      return concat(this.getCurrentMatchday(), this.getCurrentUser()).toPromise();
    } else {
      return this.getCurrentMatchday().toPromise();
    }
  }

  setUser(user?: User) {
    this.user = user;
    user = user || this.auth.user;
    if (user) {
      this.loadTeams(user.teams);
    } else {
      this.team = null;
    }
  }

  loadTeams(teams?: Team[]) {
    teams = teams || [];
    this.teams = teams;
    this.setCurrentTeam(this.teams[0]);
  }

  setCurrentTeam(team: Team) {
    if (team) {
      this.team = team;
      this.championship = team.championship;
    }
  }
}
