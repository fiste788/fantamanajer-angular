import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { Event, NavigationStart, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PushService } from '@app/services';
import { Championship, Team } from '@shared/models';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  @ViewChildren(MatListItem, { read: ElementRef }) public links?: QueryList<ElementRef<HTMLLIElement>>;

  public deferredPrompt?: BeforeInstallPromptEvent;
  public loggedIn: boolean;
  public team?: Team;
  public championship?: Championship;
  public navStart$: Observable<Event>;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly push: PushService,
    private readonly app: ApplicationService,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    this.init();
    this.refresh();
  }

  public init(): void {
    this.push.beforeInstall.subscribe((e: BeforeInstallPromptEvent) => {
      this.deferredPrompt = e;
    });
    combineLatest([this.auth.userChange$, this.app.teamChange$])
      .subscribe(() => {
        this.refresh();
      });
    this.navStart$ = this.router.events.pipe(
      filter((evt) => evt instanceof NavigationStart),
    );
    this.navStart$.pipe(
      mergeMap(() => this.layoutService.isHandset$),
      filter((r) => r),
    )
      .subscribe(() => {
        this.layoutService.closeSidebar();
      });
  }

  public refresh(): void {
    this.loggedIn = this.auth.loggedIn();
    this.team = this.app.team;
    this.championship = this.app.championship;
  }

  public install(): boolean {
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
