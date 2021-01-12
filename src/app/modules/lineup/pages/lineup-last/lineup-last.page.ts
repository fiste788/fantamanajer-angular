import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { LineupService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';
import { Lineup, Team } from '@data/types';

@Component({
  styleUrls: ['./lineup-last.page.scss'],
  templateUrl: './lineup-last.page.html',
})
export class LineupLastPage implements OnDestroy {
  @ViewChild(NgForm) public lineupForm: NgForm;
  @ViewChild(LineupDetailComponent) public lineupDetail: LineupDetailComponent;

  public lineup$: Observable<Lineup>;
  public editMode = false;
  public teamId: number;
  private subscription?: Subscription;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly lineupService: LineupService,
    private readonly route: ActivatedRoute,
    public app: ApplicationService,
  ) {
    this.teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id ?? 0;
    this.editMode = this.app.team?.id === this.teamId;
    this.lineup$ = this.lineupService.getLineup(this.teamId);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public save(): void {
    if (this.lineupForm.valid === true) {
      const lineup = this.lineupDetail.getLineup();
      let obs: Observable<Partial<Lineup>>;
      let message: string;
      if (lineup.id) {
        message = 'Formazione aggiornata';
        obs = this.lineupService.update(lineup);
      } else {
        message = 'Formazione caricata';
        obs = this.lineupService.create(lineup);
      }
      this.subscription = obs.subscribe(
        (response) => {
          if (response.id) {
            lineup.id = response.id;
          }
          this.snackBar.open(message, undefined, {
            duration: 3000,
          });
        },
        (err) => {
          UtilService.getUnprocessableEntityErrors(this.lineupForm, err);
        },
      );
    } else {
      this.snackBar.open('Si sono verificati errori di validazione', undefined, {
        duration: 3000,
      });
    }
  }
}
