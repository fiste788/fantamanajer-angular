import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations/router-transition.animation';

@Component({
  selector: 'fm-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss'],
  animations: [routerTransition]
})
export class LineupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getState(outlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.activatedRouteData.state;
  }

}
