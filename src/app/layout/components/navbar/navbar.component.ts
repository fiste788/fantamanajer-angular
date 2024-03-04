import { NgIf, AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Event, NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { ApplicationService, PwaService } from '@app/services';
import { Championship, Matchday, Team } from '@data/types';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { ProfileComponent } from '../profile/profile.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  animations: [closeAnimation],
  selector: 'app-navbar[sidenav]',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    ProfileComponent,
    MatListModule,
    NgIf,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    RouterLinkActive,
    MatDividerModule,
    AsyncPipe,
    SpeedDialComponent,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public sidenav!: MatSidenav;

  protected deferredPrompt$?: Observable<BeforeInstallPromptEvent>;
  protected readonly loggedIn$: Observable<boolean>;
  protected readonly team$: Observable<Team | undefined>;
  protected readonly matchday$: Observable<Matchday | undefined>;
  protected readonly championship$: Observable<Championship | undefined>;
  protected readonly navStart$: Observable<Event>;
  protected readonly openedSidebar$: Observable<boolean>;
  protected readonly showedSpeedDial$: Observable<VisibilityState>;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly pwa: PwaService,
    private readonly app: ApplicationService,
    private readonly router: Router,
  ) {
    this.deferredPrompt$ = this.pwa.beforeInstall$;
    this.showedSpeedDial$ = this.isShowedSpeedDial();
    this.loggedIn$ = this.auth.loggedIn$;
    this.matchday$ = this.app.matchday$;
    this.team$ = this.app.team$;
    this.openedSidebar$ = this.layoutService.openedSidebar$;
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

  public clickNav(): void {
    this.layoutService.toggleSidebar();
  }

  private isShowedSpeedDial(): Observable<VisibilityState> {
    return combineLatest([this.layoutService.isShowSpeedDial$, this.auth.loggedIn$]).pipe(
      map(([v, u]) => (u ? v : VisibilityState.Hidden)),
    );
  }
}
