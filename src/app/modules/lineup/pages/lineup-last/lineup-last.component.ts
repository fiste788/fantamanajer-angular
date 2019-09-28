import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { LineupService, ApplicationService } from '@app/core/services';
import { SharedService } from '@app/shared/services/shared.service';
import { Lineup } from '@app/core/models';

@Component({
  selector: 'fm-lineup-last',
  templateUrl: './lineup-last.component.html',
  styleUrls: ['./lineup-last.component.scss']
})
export class LineupLastComponent implements OnDestroy {
  @ViewChild(NgForm, { static: false }) lineupForm: NgForm;

  lineup: Observable<Lineup>;
  editMode = false;
  teamId: number;
  private subscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private lineupService: LineupService,
    private route: ActivatedRoute,
    public app: ApplicationService
  ) {
    this.teamId = this.route.parent.parent.parent.snapshot.data.team.id;
    this.editMode = this.app.team.id === this.teamId;
    this.lineup = this.lineupService.getLineup(this.teamId);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  save(lineup: Lineup) {
    lineup.module = lineup.module_object.key;
    lineup.dispositions.forEach(value => value.member_id = value.member ? value.member.id : null);
    let obs: Observable<Lineup> = null;
    let message = null;
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
      this.snackBar.open(message, null, {
        duration: 3000
      });
    },
      err => SharedService.getUnprocessableEntityErrors(this.lineupForm, err));
  }
}
