import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthenticationService } from '@app/authentication';
import { Championship, Matchday, Team, User } from '@data/types';
import { MatchdayService } from '@data/services';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  public seasonEnded: boolean;
  public seasonStarted: boolean;
  public selectedMatchday: Matchday;
  public championship?: Championship;
  public teamChange$ = new BehaviorSubject<Team | undefined>(undefined);
  public teams?: Array<Team>;
  private selectedTeam?: Team;
  private currentMatchday: Matchday;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly authService: AuthenticationService,
    private readonly matchdayService: MatchdayService,
    private readonly injector: Injector,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/fantamanajer-icons.svg'),
    );
  }

  get team(): Team | undefined {
    return this.selectedTeam;
  }

  set team(team: Team | undefined) {
    if (team) {
      // eslint-disable-next-line
      if (this.selectedTeam && team.championship === undefined) {
        team.championship = this.selectedTeam?.championship;
      }
      this.selectedTeam = team;
      this.championship = team.championship;
      if (this.championship.season_id !== this.matchday.season_id) {
        this.seasonStarted = false;
        this.seasonEnded = true;
      } else {
        this.recalcSeason(this.matchday);
      }
    }
  }

  get matchday(): Matchday {
    return this.selectedMatchday;
  }

  set matchday(matchday: Matchday) {
    this.selectedMatchday = matchday;
    this.recalcSeason(matchday);
  }

  public initialize(): Observable<unknown> {
    const obs: Array<Observable<unknown>> = [];
    obs.push(this.loadCurrentMatchday());
    if (this.authService.loggedIn()) {
      obs.push(this.loadCurrentUser());
    }

    return forkJoin(obs).pipe(
      tap(() => this.connectObservables()),
      catchError((e: unknown) => {
        this.writeError(e as Error);

        return of();
      }),
    );
  }

  private recalcSeason(matchday: Matchday): void {
    this.seasonEnded = matchday.number > environment.matchdaysCount;
    this.seasonStarted = matchday.number > 0;
  }

  private connectObservables(): void {
    this.teamChange$.subscribe((t) => this.setTeam(t));
    this.authService.userChange$.subscribe((u) => this.setUser(u));
  }

  private writeError(e: Error): void {
    const el = this.document.querySelector('.error');
    if (el !== null) {
      el.textContent =
        "Si è verificato un errore nel caricamento dell'app. Ricarica la pagina per riprovare";
    }
    throw e;
  }

  private loadCurrentUser(): Observable<User> {
    return this.authService.getCurrentUser().pipe(
      tap((u) => {
        this.setUser(u);
      }),
    );
  }

  private loadCurrentMatchday(): Observable<Matchday> {
    return this.matchdayService.getCurrentMatchday().pipe(
      tap((m) => {
        this.currentMatchday = m;
        this.matchday = m;
      }),
    );
  }

  private setUser(user?: User): void {
    if (user) {
      this.loadTeams(user.teams);
    } else {
      this.teams = undefined;
      this.selectedTeam = undefined;
      this.matchday = this.currentMatchday;
      void this.getRouter().navigate(['/']);
    }
  }

  private setTeam(team?: Team): void {
    this.team = team;
    if (team) {
      void this.getRouter().navigateByUrl(`/teams/${team.id}`);
    }
  }

  private loadTeams(teams?: Array<Team>): void {
    this.teams = teams ?? [];
    if (this.teams.length) {
      this.team = this.teams[0];
    }
  }

  private getRouter(): Router {
    return this.injector.get(Router);
  }
}
