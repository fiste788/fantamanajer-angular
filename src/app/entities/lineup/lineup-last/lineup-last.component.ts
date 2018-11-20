import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { LineupService } from '../lineup.service';
import { SharedService } from '../../../shared/shared.service';
import { ApplicationService } from '../../../core/application.service';
import { Lineup } from '../lineup';
import { Team } from '../../team/team';

@Component({
  selector: 'fm-lineup-last',
  templateUrl: './lineup-last.component.html',
  styleUrls: ['./lineup-last.component.scss']
})
export class LineupLastComponent implements OnInit, OnDestroy {
  @ViewChild(NgForm) lineupForm: NgForm;

  lineup: Observable<Lineup>;
  editMode = false;
  teamId: number;
  private subscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private lineupService: LineupService,
    private route: ActivatedRoute,
    public shared: SharedService,
    public app: ApplicationService
  ) { }

  ngOnInit() {
    this.route.parent.parent.parent.data.subscribe((data: { team: Team }) => {
      this.teamId = data.team.id;
      this.editMode = this.app.team.id === this.teamId;
      this.lineup = this.lineupService.getLineup(this.teamId);
    });
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
      lineup.id = response.id;
      this.snackBar.open(message, null, {
        duration: 3000
      });
    },
      err => this.shared.getUnprocessableEntityErrors(this.lineupForm, err));
  }
}
