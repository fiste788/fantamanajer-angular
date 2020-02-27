import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ChampionshipService } from '@app/core/http';
import { Championship, League } from '@app/shared/models';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-championship-detail',
  templateUrl: './championship-detail.component.html',
  styleUrls: ['./championship-detail.component.scss']
})
export class ChampionshipDetailComponent implements OnInit {

  @ViewChild(NgForm) championshipForm: NgForm;
  championship: Championship;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly championshipService: ChampionshipService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.parent?.parent?.parent?.params.championship_id) {
      this.route.parent?.parent?.parent?.data.subscribe((data: { championship: Championship }) => {
        this.championship = data.championship;
      });
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
          SharedService.getUnprocessableEntityErrors(this.championshipForm, err);
        }
      );
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

}
