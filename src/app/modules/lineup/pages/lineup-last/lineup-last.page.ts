import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { LineupService } from '@app/http';
import { ApplicationService, UtilService } from '@app/services';
import { LineupDetailComponent } from '@modules/lineup/components/lineup-detail/lineup-detail.component';
import { Lineup, Team } from '@shared/models';

@Component({
  templateUrl: './lineup-last.page.html',
  styleUrls: ['./lineup-last.page.scss']
})
export class LineupLastPage implements OnDestroy {
  @ViewChild(NgForm) lineupForm: NgForm;
  @ViewChild(LineupDetailComponent) lineupDetail: LineupDetailComponent;

  lineup$: Observable<Lineup>;
  editMode = false;
  teamId: number;
  private subscription?: Subscription;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly lineupService: LineupService,
    private readonly route: ActivatedRoute,
    public app: ApplicationService
  ) {
    this.teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id ?? 0;
    this.editMode = this.app.team?.id === this.teamId;
    this.lineup$ = this.lineupService.getLineup(this.teamId);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  save(): void {
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
      this.subscription = obs.subscribe(response => {
        if (response.id) {
          lineup.id = response.id;
        }
        this.snackBar.open(message, undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.lineupForm, err);
        });
    }
  }
}
