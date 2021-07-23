import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PushService } from '@app/services';
import { Championship, Team } from '@data/types';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public deferredPrompt$?: Observable<BeforeInstallPromptEvent>;
  public loggedIn$: Observable<boolean>;
  public teamChange$: Observable<Team | undefined>;
  public championship?: Championship;
  public navStart$: Observable<Event>;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly push: PushService,
    private readonly app: ApplicationService,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    this.loggedIn$ = this.auth.loggedIn$;
    this.teamChange$ = this.app.teamChange$.pipe(tap((t) => (this.championship = t?.championship)));
    this.deferredPrompt$ = this.push.beforeInstall$;
    this.navStart$ = this.router.events.pipe(filter((evt) => evt instanceof NavigationStart));
    this.subscriptions.add(
      this.navStart$
        .pipe(
          mergeMap(() => this.layoutService.isHandset$),
          filter((r) => r),
        )
        .subscribe(() => {
          this.layoutService.closeSidebar();
        }),
    );
  }

  public install(event: BeforeInstallPromptEvent): void {
    void event.prompt();
    void event.userChoice.then(() => {
      this.deferredPrompt$ = undefined;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
