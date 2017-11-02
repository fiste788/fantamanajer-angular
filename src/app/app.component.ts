import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatSidenav, MatMenu } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';

import { AuthService } from './auth/auth.service';
import { SharedService } from './shared/shared.service';
import {
  SmdFabSpeedDialTrigger,
  SmdFabSpeedDialActions,
  SmdFabSpeedDialComponent
} from './speeddial/smd-fab-speed-dial';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';

@Component({
  selector: 'fm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) nav: MatSidenav;

  openSpeeddial = false;
  title = 'FantaManajer';
  links = [];

  constructor(
    public media: ObservableMedia,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public shared: SharedService
  ) {
    /*this.links.push(
      { label: 'Homepage', link: '/home', icon: 'home'}):
      {
        label: this.shared.currentTeam ? this.shared.currentTeam.name : '',
        link: '/teams/{{this.shared.currentTeam.id}}',
        icon: 'account_box',
        show: this.auth.loggedIn
      },
      {
        label: this.shared.currentChampionship
          ? this.shared.currentChampionship.league.name
          : '',
        link: '/championships/{{this.shared.currentChampionship.id}}',
        icon: 'bubble_chart',
        show: this.auth.loggedIn
      },
      {
        label: 'Clubs',
        link: '/clubs',
        icon: 'group_work',
        show: () => true
      },
      {
        label: 'Impostazioni',
        link: '/profile',
        icon: 'settings',
        show: this.auth.loggedIn
      },
      {
        label: 'Log In',
        link: 'login',
        icon: 'exit_to_app',
        show: !this.auth.loggedIn
      },
      {
        label: 'Log Out',
        link: 'exit_to_app',
        icon: 'input',
        show: this.auth.loggedIn
      }
    ];*/
    this.shared.initialize();
  }

  getLinks() {
    const links = [];
    links.push({ label: 'Homepage', link: '/home', icon: 'home' });
    if (this.auth.loggedIn()) {
      links.push({
        label: 'Log In',
        link: 'login',
        icon: 'exit_to_app'
      });
    } else {
      links.push({
        label: 'Log Out',
        link: 'exit_to_app',
        icon: 'input'
      });
    }
    return links;
  }

  changeTab(tab): void {
    this.router.navigate([tab], { relativeTo: this.route });
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
