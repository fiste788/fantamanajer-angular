import { OverlayContainer } from '@angular/cdk/overlay';
import { effect, inject, Injectable } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';

import { LayoutService } from './layout.service';

@Injectable({ providedIn: 'root' })
export class AppOverlayContainer extends OverlayContainer {
  private readonly layoutService = inject(LayoutService);
  private readonly loggedIn = inject(AuthenticationService).loggedIn;

  constructor() {
    super();
    effect(() => {
      const el = super.getContainerElement();
      el.classList.toggle('with-bars', this.layoutService.showBars() === VisibilityState.Visible);
      el.classList.toggle('loggedin', this.loggedIn());
    });
  }
}
