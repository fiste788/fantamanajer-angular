import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { routerTransition } from '@shared/animations';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
  ],
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
})
export class RouterOutletComponent {

}
