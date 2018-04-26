import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { ApplicationService } from '../../core/application.service';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public app: ApplicationService
  ) { }

  ngOnInit() {
  }

}
