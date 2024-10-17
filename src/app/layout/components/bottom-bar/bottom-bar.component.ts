import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIcon,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatRippleModule,
  ],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;
  protected readonly team$ = inject(ApplicationService).team$;
  protected readonly championship$ = this.team$.pipe(map((t) => t?.championship));
}
