import { Component, OnInit } from '@angular/core';
import { ApplicationService, AuthService, PushService, LayoutService } from '@app/core/services';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public deferredPrompt?: BeforeInstallPromptEvent;

  constructor(
    public layoutService: LayoutService,
    public auth: AuthService,
    private push: PushService,
    public app: ApplicationService
  ) { }

  ngOnInit() {
    this.push.beforeInstall.subscribe((e: BeforeInstallPromptEvent) => {
      this.deferredPrompt = e;
    });
  }

  install() {
    if (this.deferredPrompt) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
        .then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          this.deferredPrompt = undefined;
        });
    }
  }

  closeSidenav() {
    this.layoutService.closeSidebar();
  }

}
