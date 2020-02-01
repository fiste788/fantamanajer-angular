import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Championship, League } from '@app/core/models';
import { ChampionshipService } from '@app/core/services';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-championship-detail',
  templateUrl: './championship-detail.component.html',
  styleUrls: ['./championship-detail.component.scss']
})
export class ChampionshipDetailComponent implements OnInit {

  @ViewChild(NgForm) championshipForm: NgForm;
  public championship: Championship;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private championshipService: ChampionshipService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.parent?.parent?.parent?.params.championship_id) {
      this.route.parent?.parent?.parent?.data.subscribe((data: { championship: Championship }) => {
        this.championship = data.championship;
      });
    } else {
      this.championship = new Championship();
      this.championship.league = new League();
    }
  }

  save() {
    this.championshipService.save(this.championship).subscribe(() => {
      this.snackBar.open('Modifiche salvate', undefined, {
        duration: 3000
      });
    },
      err => SharedService.getUnprocessableEntityErrors(this.championshipForm, err)
    );
  }

  formatLabel(value: number) {
    return value + '%';
  }

}
