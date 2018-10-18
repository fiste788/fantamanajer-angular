import { Component, OnInit, ViewChild } from '@angular/core';
import { Team } from '../../../entities/team/team';
import { User } from '../../../entities/user/user';
import { TeamService } from '../../../entities/team/team.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../../shared/shared.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Championship } from '../../../entities/championship/championship';

@Component({
  selector: 'fm-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  @ViewChild(NgForm) teamForm: NgForm;
  public team = new Team();

  constructor(private teamService: TeamService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.parent.parent.data.subscribe((data: { championship: Championship }) => {
      this.team.championship_id = data.championship.id;
      this.team.user = new User();
    });
  }

  save() {
    this.teamService.save(this.team).subscribe(response => {
      this.team.id = response.id;
      this.snackBar.open('Modifiche salvate', null, {
        duration: 3000
      });
      this.router.navigateByUrl(
        '/teams/' + this.team.id + '/admin/members'
      );
    },
      err => this.sharedService.getUnprocessableEntityErrors(this.teamForm, err)
    );
  }

}
