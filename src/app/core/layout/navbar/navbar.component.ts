import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { AuthenticationService } from '@app/authentication';
import { ApplicationService, LayoutService, PushService } from '@app/services';
import { Championship, Team } from '@shared/models';
import { fromEvent } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChildren(MatListItem, { read: ElementRef }) links?: QueryList<ElementRef<HTMLLIElement>>;

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

  ngAfterViewInit(): void {
    this.attachCloseSidebar();
  }

  ngAfterViewChecked(): void {
    this.attachCloseSidebar();
  }

  init(): void {
    this.loggedIn = this.auth.loggedIn();
    this.team = this.app.team;
    this.championship = this.app.championship;
  }

  attachCloseSidebar(): void {
    if (this.links) {
      this.links.forEach(e => {
        fromEvent(e.nativeElement, 'click')
          .subscribe(() => {
            this.layoutService.closeSidebar();
          });
      });
    }
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
