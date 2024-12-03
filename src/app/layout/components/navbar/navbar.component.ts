import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { ApplicationService, PwaService } from '@app/services';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { ProfileComponent } from '../profile/profile.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [closeAnimation],
  selector: 'app-navbar',
  styleUrl: './navbar.component.scss',
  templateUrl: './navbar.component.html',
  imports: [
    ProfileComponent,
    MatListModule,
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
  readonly #subscriptions = new Subscription();
  readonly #layoutService = inject(LayoutService);

  protected deferredPrompt$ = inject(PwaService).beforeInstall$;
  protected readonly opensidebar = this.#layoutService.openSidebar;
  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;
  protected readonly team$ = inject(ApplicationService).team$;
  protected readonly matchday$ = inject(ApplicationService).matchday$;
  protected readonly championship$ = this.team$.pipe(map((t) => t?.championship));
  protected readonly navStart$ = inject(Router).events.pipe(
    filter((evt) => evt instanceof NavigationStart),
  );

  protected readonly openSidebar = inject(LayoutService).openSidebar;
  protected readonly showedSpeedDial$ = this.#isShowedSpeedDial();

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    this.#subscriptions.add(
      this.navStart$.pipe(map(() => this.#layoutService.closeSidebar())).subscribe(),
    );
  }

  public async install(prompt: BeforeInstallPromptEvent, event: MouseEvent): Promise<boolean> {
    event.preventDefault();
    await prompt.prompt();

    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      delete this.deferredPrompt$;

      return true;
    }

    return false;
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public clickNav(): void {
    this.#layoutService.toggleSidebar();
  }

  #isShowedSpeedDial(): Observable<VisibilityState> {
    return combineLatest([this.#layoutService.isShowSpeedDial$, this.loggedIn$]).pipe(
      map(([v, u]) => (u ? v : VisibilityState.Hidden)),
    );
  }
}
