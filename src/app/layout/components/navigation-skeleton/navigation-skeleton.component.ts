import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { AuthenticationService } from '@app/authentication';
import { RangePipe } from '@shared/pipes';

@Component({
  selector: 'app-navigation-drawer-skeleton',
  imports: [ContentLoaderModule, RangePipe],
  templateUrl: './navigation-drawer-skeleton.component.html',
  styleUrl: './navigation-drawer-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerSkeletonComponent {
  protected readonly loggedIn = inject(AuthenticationService).loggedIn();
  protected items = this.loggedIn ? 6 : 3;
}
