import { Component, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService, AuthService } from '@app/core/services';

@Component({
  selector: 'fm-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss']
})
export class SpeedDialComponent implements OnChanges {
  openSpeeddial = false;
  loggedIn = false;

  constructor(
    public auth: AuthService,
    private readonly router: Router,
    public app: ApplicationService) { }

  ngOnChanges(): void {
    this.loggedIn = this.auth.loggedIn();
  }

  _click(action: string): void {
    let url;
    switch (action) {
      case 'transfert': url = `/teams/${this.app.team?.id}/transferts`; break;
      case 'lineup': url = `/teams/${this.app.team?.id}/lineup/current`; break;
      case 'article': url = '/articles/new'; break;
      default:
    }
    if (url) {
      void this.router.navigateByUrl(url);
    }
  }

}
