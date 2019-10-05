import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fm-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  animations: [routerTransition]
})
export class MemberComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getState(outlet: RouterOutlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.activatedRouteData.state;
  }

}
