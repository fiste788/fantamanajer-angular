import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Team, User, Championship } from '@app/core/models';
import { SharedService } from '@app/shared/services/shared.service';
import { TeamService } from '@app/core/services';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'fm-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  @ViewChild(NgForm) teamForm: NgForm;
  public team = new Team();

  constructor(
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent?.parent?.parent?.data.subscribe((data: { championship: Championship }) => {
      this.team.championship_id = data.championship.id;
      this.team.user = new User();
    });
  }

  save() {
    this.teamService.save(this.team).subscribe(response => {
      this.team.id = response.id;
      this.snackBar.open('Modifiche salvate', undefined, {
        duration: 3000
      });
      this.router.navigateByUrl(
        '/teams/' + this.team.id + '/admin/members'
      );
    },
      err => SharedService.getUnprocessableEntityErrors(this.teamForm, err)
    );
  }

}
