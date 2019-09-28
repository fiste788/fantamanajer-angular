import { Component } from '@angular/core';
import { tabTransition, routerTransition } from '@app/core/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [tabTransition, routerTransition]
})
export class UserComponent {

  public tabs: any = [
    { label: 'Profilo', link: '../profile' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor() { }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
  }


}
