import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Championship, Team } from '@data/types';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIcon,
    NgIf,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
  ],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
  protected readonly loggedIn$: Observable<boolean>;
  protected readonly team$: Observable<Team | undefined>;
  protected readonly championship$: Observable<Championship | undefined>;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly app: ApplicationService,
  ) {
    this.loggedIn$ = this.auth.loggedIn$;
    this.team$ = this.app.team$;
    this.championship$ = this.app.team$.pipe(map((t) => t?.championship));
  }
}
