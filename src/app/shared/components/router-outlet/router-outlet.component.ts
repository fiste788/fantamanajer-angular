import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { routerTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  standalone: true,
  imports: [RouterOutlet, StatePipe],
})
export class RouterOutletComponent {}
