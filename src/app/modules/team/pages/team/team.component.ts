import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations';

@Component({
  selector: 'fm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  animations: [routerTransition]
})
export class TeamComponent implements OnInit {

  constructor() {
  }
  ngOnInit(): void {
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
