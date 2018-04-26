import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatchdayService } from '../entities/matchday/matchday.service';
import { Matchday } from '../entities/matchday/matchday';
import { Team } from '../entities/team/team';
import { User } from '../user/user';
import { Championship } from '../entities/championship/championship';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { NgForm } from '@angular/forms';
import { PushService } from 'app/shared/push/push.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { WindowRef } from 'app/core/WindowRef';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {

  constructor(
    private auth: AuthService,
    private pushService: PushService,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private winRef: WindowRef
  ) { }

  initialize() {
    this.auth.loggedUser.subscribe(this.initializeUser.bind(this));
    this.checkForUpdates();
  }

  initializeUser(user?: User) {
    if (user && environment.production) {
      this.pushService.subscribeToPush();
      this.pushService.showMessages();
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
