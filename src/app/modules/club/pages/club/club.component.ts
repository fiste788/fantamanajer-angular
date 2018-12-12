import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations';

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

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

}
