import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../core/application.service';
import { AuthService } from '../../shared/auth/auth.service';
import { MainComponent } from '../main/main.component';
import { PushService } from '../../shared/push/push.service';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public deferredPrompt;
  constructor(public main: MainComponent,
    public auth: AuthService,
    private push: PushService,
    public app: ApplicationService) { }

  ngOnInit() {
    this.push.beforeInstall.subscribe(e => {
      this.deferredPrompt = e;
    });
  }

  install() {
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

}
