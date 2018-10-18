import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Championship } from '../../../entities/championship/championship';
import { ChampionshipService } from '../../../entities/championship/championship.service';
import { SharedService } from '../../../shared/shared.service';
import { League } from '../../../entities/league/league';

@Component({
  selector: 'fm-championship-detail',
  templateUrl: './championship-detail.component.html',
  styleUrls: ['./championship-detail.component.scss']
})
export class ChampionshipDetailComponent implements OnInit {

  @ViewChild(NgForm) championshipForm: NgForm;
  public championship: Championship;

  constructor(private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private championshipService: ChampionshipService) { }

  ngOnInit() {
    if (this.route.snapshot.parent.parent.parent.params['championship_id']) {
      this.route.parent.parent.parent.data.subscribe((data: { championship: Championship }) => {
        this.championship = data.championship;
      });
    } else {
      this.championship = new Championship();
      this.championship.league = new League();
    }
  }

  save() {
    this.championshipService.save(this.championship).subscribe(response => {
      this.snackBar.open('Modifiche salvate', null, {
        duration: 3000
      });
    },
      err => this.sharedService.getUnprocessableEntityErrors(this.championshipForm, err)
    );
  }

  formatLabel(value) {
    return value + '%';
  }

}
