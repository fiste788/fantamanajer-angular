import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { AuthenticationService } from '@app/authentication';
import { RangePipe } from '@shared/pipes';

@Component({
  selector: 'app-navigation-skeleton',
  imports: [ContentLoaderModule, RangePipe],
  templateUrl: './navigation-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSkeletonComponent {
  protected readonly loggedIn = inject(AuthenticationService).isLoggedIn();
  protected mainItems = this.loggedIn ? 4 : 2;
  protected profileItems = this.loggedIn ? 2 : 1;
  protected railOffset = 88;
  protected drawerOffset = 44;
}
