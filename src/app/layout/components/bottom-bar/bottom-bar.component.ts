import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { ApplicationService } from '@app/services';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { NavbarListComponent } from '../navbar-list/navbar-list.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [closeAnimation],
  selector: 'app-bottom-bar',
  imports: [MatToolbarModule, NavbarListComponent, AsyncPipe, SpeedDialComponent],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
  readonly #layoutService = inject(LayoutService);

  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;
  protected readonly team$ = inject(ApplicationService).team$;
  protected readonly championship$ = this.team$.pipe(map((t) => t?.championship));
  protected readonly openSpeedDial = this.#layoutService.openSpeedDial;
  protected readonly showSpeedDial = this.#layoutService.showSpeedDial;
  protected readonly stable = this.#layoutService.stable;
  protected readonly hidden = VisibilityState.Hidden;
}
