import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PwaService } from '@app/services';
import { Championship, Matchday, Team } from '@data/types';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public deferredPrompt$?: Observable<BeforeInstallPromptEvent>;
  public loggedIn$: Observable<boolean>;
  public team$: Observable<Team | undefined>;
  public matchday$: Observable<Matchday | undefined>;
  public championship$: Observable<Championship>;
  public navStart$: Observable<Event>;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly pwa: PwaService,
    private readonly app: ApplicationService,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    this.loggedIn$ = this.auth.loggedIn$;
    this.matchday$ = this.app.matchday$;
    this.team$ = this.app.team$;
    this.championship$ = this.app.requireTeam$.pipe(map((t) => t.championship));
    this.deferredPrompt$ = this.pwa.beforeInstall$;
    this.navStart$ = this.router.events.pipe(filter((evt) => evt instanceof NavigationStart));
    this.subscriptions.add(
      this.navStart$
        .pipe(
          mergeMap(() => this.layoutService.isHandset$),
          filter((r) => r),
          map(() => this.layoutService.closeSidebar()),
        )
        .subscribe(),
    );
  }

  public async install(event: BeforeInstallPromptEvent): Promise<void> {
    void event.prompt();
    return event.userChoice.then(() => {
      this.deferredPrompt$ = undefined;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
