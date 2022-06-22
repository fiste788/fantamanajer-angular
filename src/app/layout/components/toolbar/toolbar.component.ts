import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { scrollUpAnimation } from '@shared/animations';

import { LayoutService } from '../../services';

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

  protected readonly loggedIn$: Observable<boolean>;

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
