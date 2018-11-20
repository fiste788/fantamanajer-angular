import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Score } from '../score';
import { Disposition } from '../../disposition/disposition';
import { share } from 'rxjs/operators';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';

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
    private scoreService: ScoreService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.url.pop().path === 'last') {
      const team_id = this.sharedService.getTeamId(this.route);
      this.score = this.scoreService.getLastScore(team_id).pipe(share());
    } else {
      const id = parseInt(this.route.snapshot.params['id'], 10);
      this.score = this.scoreService.getScore(id).pipe(share());
    }
    this.score.subscribe(score => this.getData(score));
  }

  getData(score: Score) {
    if (score != null && score.lineup) {
      const dispositions: Disposition[] = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
      // this.score = score;
    }
  }
}
