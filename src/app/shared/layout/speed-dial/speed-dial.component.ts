import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ApplicationService } from '@app/core/services';

@Component({
  selector: 'fm-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss']
})
export class SpeedDialComponent implements OnInit {
  openSpeeddial = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    public app: ApplicationService) { }

  ngOnInit() {
  }

  _click(event: any) {
    let url = null;
    switch (event) {
      case 'transfert': url = '/teams/' + (this.app.team?.id || '') + '/transferts'; break;
      case 'lineup': url = '/teams/' + (this.app.team?.id || '') + '/lineup/current'; break;
      case 'article': url = '/articles/new'; break;
    }
    if (url) {
      this.router.navigateByUrl(url);
    }
  }

}
