import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, ActivatedRoute, Route } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'fm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild(MatSidenav) nav: MatSidenav;
  title = 'FantaManajer';

  constructor(
    public media: ObservableMedia,
    public shared: SharedService,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.shared.initialize();
  }

  ngOnInit() {
    if (this.media.isActive('lt-sm') && this.nav) {
      this.nav.close();
    }
    /*this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      // filter((route: ActivatedRoute) => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute) => route.data)
    ).subscribe((event) => {
      this.titleService.setTitle(event['title'] || 'FantaManajer');
    });*/
  }

  closeSidenav() {
    if (this.media.isActive('xs') && this.nav) {
      this.nav.close();
    }
  }

}
