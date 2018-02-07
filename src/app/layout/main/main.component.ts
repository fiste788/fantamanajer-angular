import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'fm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild(MatSidenav) nav: MatSidenav;
  title = 'FantaManajer';

  constructor(
    public media: ObservableMedia,
    public auth: AuthService,
    public shared: SharedService
  ) {
    this.shared.initialize();
  }

  ngOnInit() {
    if (this.media.isActive('lt-sm') && this.nav) {
      this.nav.close();
    }
  }

  closeSidenav() {
    if (this.media.isActive('xs') && this.nav) {
      this.nav.close();
    }
  }

}
