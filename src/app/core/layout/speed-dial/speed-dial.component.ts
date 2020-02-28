import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'fm-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss']
})
export class SpeedDialComponent {
  openSpeeddial = false;

  constructor(
    private readonly router: Router,
    public app: ApplicationService
  ) { }

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
