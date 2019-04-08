import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Team, Score } from '@app/core/models';
import { ScoreService } from '@app/core/services';
import { SharedService } from '@app/shared/services/shared.service';


@Component({
  selector: 'fm-score-edit',
  templateUrl: './score-edit.component.html',
  styleUrls: ['./score-edit.component.scss']
})
export class ScoreEditComponent implements OnInit {

  @ViewChild(NgForm) scoreForm: NgForm;
  public team: Team;
  public penality: boolean;
  public selectedScore: Score;
  public score: Observable<Score>;
  public scores: Observable<Score[]>;

  constructor(private route: ActivatedRoute,
              private scoreService: ScoreService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.parent.parent.parent.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.scores = this.scoreService.getScoresByTeam(this.team.id);
    });
  }

  getScore(event: MatSelectChange) {
    this.selectedScore = event.value;
    this.score = this.scoreService.getScore(this.selectedScore.id, true);
  }

  save(score: Score) {
    score.lineup.module = score.lineup.module_object.key;
    score.lineup.dispositions.forEach(value => value.member_id = value.member ? value.member.id : null);
    this.scoreService.update(score).subscribe(response => {
      this.snackBar.open('Punteggio modificato', null, {
        duration: 3000
      });
    },
      err => SharedService.getUnprocessableEntityErrors(this.scoreForm, err));
  }
}
