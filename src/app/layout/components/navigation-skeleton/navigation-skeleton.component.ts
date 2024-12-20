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
  protected readonly loggedIn = inject(AuthenticationService).loggedIn();
  protected items = this.loggedIn ? 6 : 3;
}
