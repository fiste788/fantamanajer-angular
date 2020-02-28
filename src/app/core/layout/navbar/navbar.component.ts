import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PushService } from '@app/services';
import { Championship, Team } from '@shared/models';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  deferredPrompt?: BeforeInstallPromptEvent;
  loggedIn: boolean;
  team?: Team;
  championship?: Championship;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly push: PushService,
    private readonly app: ApplicationService
  ) { }

  ngOnInit(): void {
    this.init();
    this.push.beforeInstall.subscribe((e: BeforeInstallPromptEvent) => {
      this.deferredPrompt = e;
    });
    this.auth.userChange$.pipe(combineLatest(this.app.teamChange$))
      .subscribe(() => {
        this.init();
      });
  }

  init(): void {
    this.loggedIn = this.auth.loggedIn();
    this.team = this.app.team;
    this.championship = this.app.championship;
  }

  install(): void {
    if (this.deferredPrompt) {
      // Show the prompt
      void this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      void this.deferredPrompt.userChoice
        .then(() => {
          this.deferredPrompt = undefined;
        });
    }
  }

  closeSidenav(): void {
    this.layoutService.closeSidebar();
  }

}
