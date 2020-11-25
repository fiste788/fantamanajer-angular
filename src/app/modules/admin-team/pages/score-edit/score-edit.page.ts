import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ScoreService } from '@data/services';
import { UtilService } from '@app/services';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';
import { Score, Team } from '@data/types';

@Component({
  styleUrls: ['./score-edit.page.scss'],
  templateUrl: './score-edit.page.html',
})
export class ScoreEditPage implements OnInit {
  @ViewChild(NgForm) public scoreForm: NgForm;
  @ViewChild(LineupDetailComponent) public lineupDetail: LineupDetailComponent;

  public team: Team;
  public penality: boolean;
  public selectedScore: Score;
  public score$: Observable<Score>;
  public scores$: Observable<Array<Score>>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService,
    private readonly snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    const t = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (t) {
      this.team = t;
      this.scores$ = this.scoreService.getScoresByTeam(this.team.id);
    }
  }

  public getScore(event: MatSelectChange): void {
    this.selectedScore = event.value;
    this.score$ = this.scoreService.getScore(this.selectedScore.id, true);
  }

  public save(score: Score): void {
    score.lineup = this.lineupDetail.getLineup();
    this.scoreService.update(score)
      .subscribe(() => {
        this.snackBar.open('Punteggio modificato', undefined, {
          duration: 3000,
        });
      },
        (err) => {
          UtilService.getUnprocessableEntityErrors(this.scoreForm, err);
        });
  }

  public track(_: number, item: Score): number {
    return item.id; // or item.id
  }
}
