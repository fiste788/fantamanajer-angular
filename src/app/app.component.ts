import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';
import { trigger, style, transition, animate, query, stagger, group } from '@angular/animations';

import { AuthService } from './auth/auth.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'fm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('enterApp', [
      transition('* => *', [
        group([
          query('.mat-toolbar-primary', style({ transform: 'translateY(-4em)' })),
          // query('mat-sidenav', style({ transform: 'translateX(-240px)' }))
        ]),

        group([
          query('.mat-toolbar-primary',
            animate('500ms 1ms ease-out', style({ transform: 'translateY(0)' })),
          ),
          query('mat-sidenav',
            animate('500ms 1ms ease-out', style({ transform: 'translateX(0)' })),
          )
        ]),

        group([
          query('mat-sidenav', [
            animate(1000, style('*'))
          ]),
          query('.mat-toolbar-primary', [
            animate(1000, style('*'))
          ])
        ])
      ])
    ])
  ]
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
