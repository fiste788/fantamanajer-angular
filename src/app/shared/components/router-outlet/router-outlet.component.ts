import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';

@Component({
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  imports: [RouterOutlet],
})
export class RouterOutletComponent {
  readonly #transitionService = inject(CurrentTransitionService);

  protected viewTransitionName(o: RouterOutlet): string {
    return o.isActivated && this.#transitionService.isLastOutlet(o) ? 'main' : '';
  }
}
