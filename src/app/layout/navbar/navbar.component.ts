import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../core/application.service';
import { AuthService } from '../../shared/auth/auth.service';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'fm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public main: MainComponent,
    public auth: AuthService,
    private router: Router,
    public app: ApplicationService) { }

  ngOnInit() {
  }

}
