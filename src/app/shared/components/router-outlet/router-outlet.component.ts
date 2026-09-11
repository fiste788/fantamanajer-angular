import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MainTransitionDirective } from '@shared/directives';

@Component({
  selector: 'app-router-outlet',
  imports: [MainTransitionDirective, RouterOutlet],
  templateUrl: './router-outlet.component.html',
})
export class RouterOutletComponent {}
