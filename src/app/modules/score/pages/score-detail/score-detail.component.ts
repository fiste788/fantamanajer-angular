import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from '@app/shared/services/shared.service';
import { ScoreService } from '@app/core/services';
import { Score, Disposition } from '@app/core/models';
import { TableRowAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.scss'],
  animations: [TableRowAnimation]
})
export class ScoreDetailComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';

  score: Observable<Score>;
  regular: Disposition[];
  notRegular: Disposition[];

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.url.pop().path === 'last') {
      const team_id = SharedService.getTeamId(this.route);
      this.score = this.scoreService.getLastScore(team_id).pipe(map(score => this.getData(score)));
    } else {
      const id = parseInt(this.route.snapshot.params['id'], 10);
      this.score = this.scoreService.getScore(id).pipe(map(score => this.getData(score)));
    }
  }

  getData(score: Score) {
    if (score != null && score.lineup) {
      const dispositions: Disposition[] = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
    }
    return score;
  }
}
