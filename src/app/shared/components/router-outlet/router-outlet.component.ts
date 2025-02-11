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
  imports: [RouterOutlet, StatePipe],
})
export class RouterOutletComponent {
  readonly #transitionService = inject(CurrentTransitionService);

  protected viewTransitionName(o: RouterOutlet): string {
    return o.isActivated && this.#transitionService.isLastOutlet(o) ? 'main' : '';
  }
}
