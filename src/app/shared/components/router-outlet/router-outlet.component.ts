import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routerTransition } from '@app/core/animations';

@Component({
  selector: 'fm-router-outlet',
  templateUrl: './router-outlet.component.html',
  animations: [routerTransition]
})
export class RouterOutletComponent {

  constructor() {
  }

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }

}
