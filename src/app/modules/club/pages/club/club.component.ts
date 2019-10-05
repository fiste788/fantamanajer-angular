import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fm-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
  animations: [routerTransition]
})
export class ClubComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }

}
