import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
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
  loadImage: Observable<void | Event>;
  main: MainComponent;

  constructor(private injector: Injector,
    public auth: AuthService,
    public app: ApplicationService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.main = this.injector.get(MainComponent);
    this.loadImage = this.main.drawer.openedStart;
  }

  setTeam(team: Team) {
    this.main.closeSidenav();
    this.app.setCurrentTeam(team).then(() => this.changeRef.detectChanges());
    this.router.navigateByUrl('/teams/' + team.id);
  }

  load(success: boolean) {
    console.log(success);
  }

}
