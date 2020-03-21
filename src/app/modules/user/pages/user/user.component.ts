import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { routerTransition, tabTransition } from '@shared/animations';
import { Tab } from '@shared/models';

@Component({
  selector: 'fm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [tabTransition, routerTransition]
})
export class UserComponent {

  tabs: Array<{ label: string, link: string }> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Attività', link: 'stream' }
  ];

  getState(outlet: RouterOutlet): string {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }

  track(_: number, item: Tab): string {
    return item.link;
  }

}
