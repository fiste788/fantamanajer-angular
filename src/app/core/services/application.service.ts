import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { Championship, Matchday, Team, User } from '../models';
import { AuthService } from './auth.service';
import { MatchdayService } from './matchday.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  seasonEnded: boolean;
  seasonStarted: boolean;
  matchday: Matchday;
  championship?: Championship;
  teamChange$ = new BehaviorSubject<Team | undefined>(undefined);
  user?: User;
  teams?: Array<Team>;
  private currentTeam?: Team;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly auth: AuthService,
    private readonly matchdayService: MatchdayService,
    private readonly injector: Injector
  ) { }

  getCurrentMatchday(): Observable<void> {
    return this.matchdayService.getCurrentMatchday()
      .pipe(
        map(m => {
          this.setCurrentMatchday(m);
        })
      );
  }

  async initialize(): Promise<void> {
    this.auth.userChange$.pipe(skip(1))
      .subscribe((u: User) => {
        this.setUser(u);
      });
    let observable = this.getCurrentMatchday();
    if (this.auth.loggedIn()) {
      observable = concat(observable, this.auth.getCurrentUser());
    }

    return observable.toPromise()
      .catch(e => {
        const el = this.document.querySelectorAll('.error')[0];
        el.textContent = 'Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare';
        throw e;
      });
  }

  setUser(user?: User): void {
    this.user = user;
    if (user) {
      this.loadTeams(user.teams);
    } else {
      this.teams = undefined;
      this.currentTeam = undefined;
      void this.getRouter()
        .navigate(['/']);
    }
  }

  loadTeams(teams?: Array<Team>): void {
    this.teams = teams ?? [];
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
    }
    if (!isNull && team) {
      void this.getRouter()
        .navigateByUrl(`/teams/${team.id}`);
      this.teamChange$.next(team);
    }
  }

  getRouter(): Router {
    return this.injector.get(Router);
  }

  private setCurrentMatchday(matchday: Matchday): void {
    this.matchday = matchday;
    this.seasonEnded = matchday.number > environment.matchdaysCount;
    this.seasonStarted = matchday.number > 0;
  }
}
