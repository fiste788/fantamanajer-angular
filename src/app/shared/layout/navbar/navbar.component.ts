import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewChecked } from '@angular/core';
import { ApplicationService, AuthService, PushService } from '@app/core/services';
import { LayoutService } from '@app/core/services/layout.service';
import { MatListItem } from '@angular/material/list';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public deferredPrompt: any;

  constructor(
    public layoutService: LayoutService,
    public auth: AuthService,
    private push: PushService,
    public app: ApplicationService
  ) { }

  ngOnInit() {
    this.push.beforeInstall.subscribe((e: any) => {
      this.deferredPrompt = e;
    });
  }

  install() {
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  closeSidenav() {
    this.layoutService.closeSidebar();
  }

}
