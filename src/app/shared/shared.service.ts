import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatchdayService } from '../matchday/matchday.service';
import { Matchday } from '../matchday/matchday';
import { Team } from '../team/team';
import { User } from '../user/user';
import { Championship } from '../championship/championship';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { NgForm } from '@angular/forms';
import { PushService } from 'app/push/push.service';
import { AuthService } from 'app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { WindowRef } from 'app/core/WindowRef';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {
  private currentSeason: number;
  public currentMatchday: Matchday;
  public currentChampionship: Championship;
  public currentTeam: Team;
  public teams: Team[];
  public tabs: any[] = [];
  public pageTitle: String = 'FantaManajer';

  constructor(
    private auth: AuthService,
    private matchdayService: MatchdayService,
    private pushService: PushService,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private winRef: WindowRef
  ) { }

  getCurrentMatchday() {
    this.matchdayService.getCurrentMatchday().subscribe(matchday => {
      this.currentMatchday = matchday;
      this.currentSeason = this.currentMatchday.season_id;
    });
  }

  initialize() {
    this.getCurrentMatchday();
    this.auth.loggedUser.subscribe((user: User) => {
      if (user) {
        this.loadTeams(user.teams);
        this.pushService.subscribeToPush();
        this.pushService.showMessages();
      } else {
        this.currentTeam = null;
      }
    });
    if (this.auth.loggedIn()) {
      this.loadTeams();
      if (environment.production) {
        this.pushService.subscribeToPush();
        this.pushService.showMessages();
      }
    }
    this.checkForUpdates();
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

  checkForUpdates() {
    this.swUpdate.available.subscribe(event => {
      console.log(
        '[App] Update available: current version is',
        event.current,
        'available version is',
        event.available
      );
      const snackBarRef = this.snackBar.open(
        'Newer version of the app is available',
        'Refresh'
      );

      snackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload();
      });
    });
  }

  getUnprocessableEntityErrors(form: NgForm, err: any) {
    if (err.status === 422) {
      const errors = err.error.data.errors;
      Object.keys(errors).forEach(key => {
        if (form.controls.hasOwnProperty(key)) {
          form.controls[key].setErrors(errors[key]);
        }
      });
      console.log(err);
    }
  }

  getTeamId(route: ActivatedRoute): number {
    for (const x in route.snapshot.pathFromRoot) {
      if (route.pathFromRoot.hasOwnProperty(x)) {
        const current = route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }
}
