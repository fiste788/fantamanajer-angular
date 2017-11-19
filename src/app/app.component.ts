import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';

import { AuthService } from './auth/auth.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'fm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) nav: MatSidenav;

  openSpeeddial = false;
  title = 'FantaManajer';

  constructor(
    public media: ObservableMedia,
    public auth: AuthService,
    private router: Router,
    public shared: SharedService
  ) {
    this.shared.initialize();
  }

  ngOnInit() {
    if (this.media.isActive('lt-sm') && this.nav) {
      this.nav.close();
    }
  }

  _click(event: any) {
    if (event === 'transfert') {
      this.router.navigateByUrl(
        '/teams/' + this.shared.currentTeam.id + '/transferts'
      );
    } else if (event === 'lineup') {
      this.router.navigateByUrl(
        '/teams/' + this.shared.currentTeam.id + '/lineup/current'
      );
    } else if (event === 'article') {
      this.router.navigateByUrl('/articles/new');
    }
  }

  closeSidenav() {
    if (this.media.isActive('xs') && this.nav) {
      this.nav.close();
    }
  }
}
