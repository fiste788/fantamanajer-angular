import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService, ApplicationService } from '@app/core/services';
import { Team } from '@app/core/models';
import { Router } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loadImage: Observable<void>;

  constructor(public main: MainComponent,
    public auth: AuthService,
    public app: ApplicationService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.loadImage = this.main.nav.openedStart;
  }

  setTeam(team: Team) {
    this.main.closeSidenav();
    this.app.setCurrentTeam(team).then(() => this.changeRef.detectChanges());
    this.router.navigateByUrl('/teams/' + team.id);
  }

}
