import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { LayoutService } from '@app/services';
import { scrollUpAnimation } from '@shared/animations';

@Component({
  animations: [scrollUpAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  @Input() public state!: VisibilityState | null;
  @Input() public showDrawerButton = false;

  public loggedIn$: Observable<boolean>;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
  ) {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  public clickNav(): void {
    this.layoutService.toggleSidebar();
  }
}
