import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MainTransitionDirective } from '@shared/directives';

@Component({
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  imports: [RouterOutlet, MainTransitionDirective],
})
export class RouterOutletComponent {}
