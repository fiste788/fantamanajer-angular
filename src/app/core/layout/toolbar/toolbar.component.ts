import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { LayoutService } from '@app/services';
import { scrollUpAnimation } from '@shared/animations';

@Component({
  selector: 'fm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [scrollUpAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Input() state: VisibilityState | null;
  @Input() showDrawerButton: boolean;

  loggedIn$: Observable<boolean>;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  clickNav(): void {
    this.layoutService.toggleSidebar();
  }

}
