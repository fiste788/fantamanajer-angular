import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { MatchdayService } from '@app/http';
import { environment } from '@env';
import { Championship, Matchday, Team, User } from '@shared/models';

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
    private readonly auth: AuthenticationService,
    private readonly matchdayService: MatchdayService,
    private readonly injector: Injector
  ) { }

  async initialize(): Promise<void> {
    this.teamChange$.subscribe(t => {
      this.setTeam(t, true);
    });
    this.auth.userChange$.pipe(skip(1))
      .subscribe((u: User) => {
        this.setUser(u);
      });

    let obs = this.getCurrentMatchday();
    if (this.auth.loggedIn()) {
      obs = forkJoin([obs, this.auth.getCurrentUser()])
        .pipe(map(() => undefined));
    }

    return obs.toPromise()
      .catch(e => {
        const el = this.document.querySelector('.error');
        if (el !== null) {
          el.textContent = 'Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare';
        }
        throw e;
      });
  }

  get team(): Team | undefined {
    return this.currentTeam;
  }

  private setUser(user?: User): void {
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

  private loadTeams(teams?: Array<Team>): void {
    this.teams = teams ?? [];
    if (this.teams.length) {
      this.setTeam(this.teams[0], false);
    }
  }

  private getRouter(): Router {
    return this.injector.get(Router);
  }

  private setTeam(team: Team | undefined, redirect = true): void {
    if (team) {
      if (this.currentTeam && team.championship === undefined) {
        team.championship = this.currentTeam?.championship;
      }
      this.currentTeam = team;
      this.championship = team.championship;
      if (this.championship.season_id !== this.matchday.season_id) {
        this.seasonStarted = false;
        this.seasonEnded = true;
      } else {
        this.setCurrentMatchday(this.matchday);
      }
      if (redirect) {
        void this.getRouter()
          .navigateByUrl(`/teams/${team.id}`);
      }
    }
  }

  private getCurrentMatchday(): Observable<void> {
    return this.matchdayService.getCurrentMatchday()
      .pipe(
        map(m => {
          this.setCurrentMatchday(m);
        })
      );
  }

  private setCurrentMatchday(matchday: Matchday): void {
    this.matchday = matchday;
    this.seasonEnded = matchday.number > environment.matchdaysCount;
    this.seasonStarted = matchday.number > 0;
  }
}
