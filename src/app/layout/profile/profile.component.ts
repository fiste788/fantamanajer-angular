import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { ApplicationService } from '../../core/application.service';
import { Team } from '../../entities/team/team';
import { Router } from '@angular/router';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public main: MainComponent,
    public auth: AuthService,
    public app: ApplicationService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  setTeam(team: Team) {
    this.main.closeSidenav();
    this.app.setCurrentTeam(team).then(() => this.changeRef.detectChanges());
    this.router.navigateByUrl('/teams/' + team.id);

  }

}
