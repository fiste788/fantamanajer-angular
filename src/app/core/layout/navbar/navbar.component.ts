import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { Event, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PushService } from '@app/services';
import { Championship, Team } from '@shared/models';
import { fromEvent, Observable } from 'rxjs';
import { combineLatest, filter, map } from 'rxjs/operators';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChildren(MatListItem, { read: ElementRef }) links?: QueryList<ElementRef<HTMLLIElement>>;

  deferredPrompt?: BeforeInstallPromptEvent;
  loggedIn: boolean;
  team?: Team;
  championship?: Championship;
  navStart$: Observable<Event>;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly push: PushService,
    private readonly app: ApplicationService,
    private readonly router: Router
  ) {
    this.navStart$ = this.router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    );
  }

  ngOnInit(): void {
    this.init();
    this.push.beforeInstall.subscribe((e: BeforeInstallPromptEvent) => {
      this.deferredPrompt = e;
    });
    this.auth.userChange$.pipe(combineLatest(this.app.teamChange$))
      .subscribe(() => {
        this.init();
      });
    this.navStart$.subscribe(() => {
      this.layoutService.closeSidebar();
    });
  }

  init(): void {
    this.loggedIn = this.auth.loggedIn();
    this.team = this.app.team;
    this.championship = this.app.championship;
  }

  install(): boolean {
    if (this.deferredPrompt) {
      // Show the prompt
      void this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      void this.deferredPrompt.userChoice
        .then(() => {
          this.deferredPrompt = undefined;
        });
    }

    return false;
  }
}
