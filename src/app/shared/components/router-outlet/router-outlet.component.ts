import { trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { routerTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  standalone: true,
  imports: [RouterOutlet, StatePipe],
})
export class RouterOutletComponent {
  private readonly transitionService = inject(CurrentTransitionService);

  protected viewTransitionName(o: RouterOutlet) {
    return o.isActivated && this.transitionService.isLastOutlet(o) ? 'main' : '';
  }
}
