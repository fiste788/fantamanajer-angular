import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, concat, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchdayService } from './matchday.service';
import { AuthService } from './auth.service';
import { Matchday, Team, User, Championship } from '../models';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public seasonEnded: boolean;
  public seasonStarted: boolean;
  public matchday: Matchday;
  public championship?: Championship;
  private currentTeam?: Team;
  public teamChange = new BehaviorSubject<Team | undefined>(undefined);
  public user?: User;
  public teams?: Team[];

  constructor(
    private auth: AuthService,
    private matchdayService: MatchdayService,
    private injector: Injector
  ) { }

  getCurrentMatchday(): Observable<void> {
    return this.matchdayService.getCurrentMatchday().pipe(map(m => this.setCurrentMatchday(m)));
  }

  private setCurrentMatchday(matchday: Matchday): void {
    this.matchday = matchday;
    this.seasonEnded = matchday.number > environment.matchdaysCount;
    this.seasonStarted = matchday.number > 0;
  }

  async initialize(): Promise<void> {
    this.auth.loggedUser.subscribe((u: User) => this.setUser(u));
    let observable = this.getCurrentMatchday();
    if (this.auth.loggedIn()) {
      observable = concat(observable, this.auth.getCurrentUser());
    }
    return observable.toPromise().catch(e => {
      const el = document.querySelectorAll('.error')[0];
      el.textContent = 'Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare';
      throw e;
    });
  }

  setUser(user?: User) {
    this.user = user;
    if (user) {
      this.loadTeams(user.teams);
    } else {
      this.teams = undefined;
      this.currentTeam = undefined;
      this.getRouter().navigate(['/']);
    }
  }

  loadTeams(teams?: Team[]) {
    teams = teams || [];
    this.teams = teams;
    if (this.teams.length) {
      this.team = this.teams[0];
    }
  }

  get team(): Team | undefined {
    return this.currentTeam;
  }

  set team(team: Team | undefined) {
    const isNull = !this.currentTeam;
    if (team && this.team !== team) {
      this.currentTeam = team;
      this.championship = team.championship;
      if (this.championship.season_id !== this.matchday.season_id) {
        this.seasonStarted = false;
        this.seasonEnded = true;
      } else {
        this.setCurrentMatchday(this.matchday);
      }
      this.getRouter().navigateByUrl('/teams/' + team.id);
    }
    if (!isNull) {
      this.teamChange.next(team);
    }
  }

  public getRouter(): Router {
    return this.injector.get(Router);
  }
}
