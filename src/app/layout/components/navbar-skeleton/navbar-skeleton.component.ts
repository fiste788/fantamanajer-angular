import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { AuthenticationService } from '@app/authentication';
import { RangePipe } from '@shared/pipes';

@Component({
  selector: 'app-navbar-skeleton',
  imports: [ContentLoaderModule, RangePipe],
  templateUrl: './navbar-skeleton.component.html',
  styleUrl: './navbar-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSkeletonComponent {
  protected readonly loggedIn = inject(AuthenticationService).loggedIn();
  protected items = this.loggedIn ? 6 : 3;
}
