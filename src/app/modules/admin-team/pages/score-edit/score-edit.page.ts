import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ScoreService } from '@app/http';
import { UtilService } from '@app/services';
import { LineupDetailComponent } from '@modules/lineup/components/lineup-detail/lineup-detail.component';
import { Score, Team } from '@shared/models';

@Component({
  templateUrl: './score-edit.page.html',
  styleUrls: ['./score-edit.page.scss']
})
export class ScoreEditPage implements OnInit {
  @ViewChild(NgForm) scoreForm: NgForm;
  @ViewChild(LineupDetailComponent) lineupDetail: LineupDetailComponent;

  team: Team;
  penality: boolean;
  selectedScore: Score;
  score$: Observable<Score>;
  scores$: Observable<Array<Score>>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const t = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (t) {
      this.team = t;
      this.scores$ = this.scoreService.getScoresByTeam(this.team.id);
    }
  }

  getScore(event: MatSelectChange): void {
    this.selectedScore = event.value;
    this.score$ = this.scoreService.getScore(this.selectedScore.id, true);
  }

  save(score: Score): void {
    score.lineup = this.lineupDetail.getLineup();
    this.scoreService.update(score)
      .subscribe(() => {
        this.snackBar.open('Punteggio modificato', undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.scoreForm, err);
        });
  }

  track(_: number, item: Score): number {
    return item.id; // or item.id
  }
}
