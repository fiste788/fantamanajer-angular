import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatchdayService } from '../entities/matchday/matchday.service';
import { Matchday } from '../entities/matchday/matchday';
import { Team } from '../entities/team/team';
import { User } from '../entities/user/user';
import { Championship } from '../entities/championship/championship';
import { AuthService } from 'app/shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { UserService } from '../entities/user/user.service';
import { map, concat } from 'rxjs/operators';
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

  initialize(): Promise<any> {
    this.auth.loggedUser.subscribe(this.setUser.bind(this));
    let observable = this.getCurrentMatchday();
    if (this.auth.loggedIn()) {
      observable = observable.pipe(concat(this.auth.getCurrentUser()));
    }
    return observable.toPromise();
  }

  setUser(user?: User) {
    if (user) {
      this.user = user;
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
