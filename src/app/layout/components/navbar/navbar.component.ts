import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, PwaService } from '@app/services';
import { Championship, Matchday, Team } from '@data/types';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  protected deferredPrompt$?: Observable<BeforeInstallPromptEvent>;
  protected readonly loggedIn$: Observable<boolean>;
  protected readonly team$: Observable<Team | undefined>;
  protected readonly matchday$: Observable<Matchday | undefined>;
  protected readonly championship$: Observable<Championship | undefined>;
  protected readonly navStart$: Observable<Event>;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly pwa: PwaService,
    private readonly app: ApplicationService,
    private readonly router: Router,
  ) {
    this.deferredPrompt$ = this.pwa.beforeInstall$;
    this.loggedIn$ = this.auth.loggedIn$;
    this.matchday$ = this.app.matchday$;
    this.team$ = this.app.team$;
    this.championship$ = this.app.team$.pipe(map((t) => t?.championship));
    this.navStart$ = this.router.events.pipe(filter((evt) => evt instanceof NavigationStart));
  }

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
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

  public async install(prompt: BeforeInstallPromptEvent, event: MouseEvent): Promise<boolean> {
    event.preventDefault();
    await prompt.prompt();

    return prompt.userChoice.then(() => {
      delete this.deferredPrompt$;

      return true;
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
