import { Component, OnInit, ViewChild } from '@angular/core';
import { Team } from '../../../entities/team/team';
import { ActivatedRoute } from '@angular/router';
import { Score } from '../../../entities/score/score';
import { ScoreService } from '../../../entities/score/score.service';
import { Observable, concat } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MemberService } from '../../../entities/member/member.service';
import { map } from '../../../../../node_modules/rxjs/operators';
import { MatSnackBar } from '../../../../../node_modules/@angular/material/snack-bar';
import { SharedService } from '../../../shared/shared.service';
import { NgForm } from '../../../../../node_modules/@angular/forms';


@Component({
  selector: 'fm-score-edit',
  templateUrl: './score-edit.component.html',
  styleUrls: ['./score-edit.component.scss']
})
export class ScoreEditComponent implements OnInit {

  @ViewChild(NgForm) scoreForm: NgForm;
  public team: Team;
  public score: Observable<Score>;
  public scores: Observable<Score[]>;

  constructor(private route: ActivatedRoute,
    private scoreService: ScoreService,
    private snackBar: MatSnackBar,
    private shared: SharedService) { }

  ngOnInit() {
    this.route.parent.parent.parent.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.scores = this.scoreService.getScoresByTeam(this.team.id);
    });
  }

  getScore(event: MatSelectChange) {
    this.score = this.scoreService.getScore(event.value.id, true);
  }

  save(score) {
    this.scoreService.update(score).subscribe(response => {
      this.snackBar.open('Punteggio modificato', null, {
        duration: 3000
      });
    },
      err => this.shared.getUnprocessableEntityErrors(this.scoreForm, err));
  }
}
