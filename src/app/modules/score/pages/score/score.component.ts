import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations';

@Component({
  selector: 'fm-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
  animations: [routerTransition]
})
export class ScoreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getState(outlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.activatedRouteData.state;
  }

}
