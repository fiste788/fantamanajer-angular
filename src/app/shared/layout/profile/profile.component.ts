import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService, ApplicationService } from '@app/core/services';
import { Team } from '@app/core/models';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent, merge } from 'rxjs';
import { LayoutService } from '@app/core/services/layout.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loadImage: Observable<boolean | Event>;

  constructor(
    private layoutService: LayoutService,
    public auth: AuthService,
    public app: ApplicationService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadImage = merge(
      this.layoutService.openedSidebar,
      fromEvent(window, 'scroll')
    );
  }

  getPhoto(): string {
    if (this.app.team.photo_url) {
      return this.app.team.photo_url['240w'];
    } else {
      return '';
    }
  }

  setTeam(team: Team) {
    this.layoutService.closeSidebar();
    this.app.setCurrentTeam(team).then(() => this.changeRef.detectChanges());
    this.router.navigateByUrl('/teams/' + team.id);
  }
}
