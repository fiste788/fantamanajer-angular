import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { ChampionshipService } from '@app/http';
import { UtilService } from '@app/services';
import { Championship, League } from '@shared/models';

@Component({
  templateUrl: './championship-detail.page.html',
  styleUrls: ['./championship-detail.page.scss']
})
export class ChampionshipDetailPage implements OnInit {
  @ViewChild(NgForm) championshipForm: NgForm;

  championship: Championship;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly championshipService: ChampionshipService
  ) { }

  ngOnInit(): void {
    const c = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (c) {
      this.championship = c;
    } else {
      this.championship = new Championship();
      this.championship.league = new League();
    }
  }

  save(): void {
    this.championshipService.save(this.championship)
      .subscribe(() => {
        this.snackBar.open('Modifiche salvate', undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.championshipForm, err);
        }
      );
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

}
