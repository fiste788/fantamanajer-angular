import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { SharedService } from '../../shared/shared.service';

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
    public shared: SharedService) { }

  ngOnInit() {
  }

  _click(event: any) {
    if (event === 'transfert') {
      this.router.navigateByUrl(
        '/teams/' + this.shared.currentTeam.id + '/transferts'
      );
    } else if (event === 'lineup') {
      this.router.navigateByUrl(
        '/teams/' + this.shared.currentTeam.id + '/lineup/current'
      );
    } else if (event === 'article') {
      this.router.navigateByUrl('/articles/new');
    }
  }

}
