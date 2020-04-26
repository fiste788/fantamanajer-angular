import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { routerTransition } from '@shared/animations';

@Component({
  selector: 'fm-router-outlet',
  templateUrl: './router-outlet.component.html',
  animations: [
    trigger('contextChange', routerTransition)
  ]
})
export class RouterOutletComponent {

}
