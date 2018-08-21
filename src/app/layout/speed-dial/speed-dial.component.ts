import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { ApplicationService } from '../../core/application.service';

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
    if (event === 'transfert') {
      this.router.navigateByUrl(
        '/teams/' + this.app.team.id + '/transferts'
      );
    } else if (event === 'lineup') {
      this.router.navigateByUrl(
        '/teams/' + this.app.team.id + '/lineup/current'
      );
    } else if (event === 'article') {
      this.router.navigateByUrl('/articles/new');
    }
  }

}
