import { NgIf, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { CurrentTransitionService } from '@app/services';
import { scrollUpAnimation } from '@shared/animations';
import { BreadcrumbComponent } from '@shared/components';

import { LayoutService } from '../../services';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  animations: [scrollUpAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    NotificationComponent,
    AsyncPipe,
  ],
})
export class ToolbarComponent {
  @Input({ transform: booleanAttribute }) public showDrawerButton = false;

  protected readonly loggedIn$: Observable<boolean>;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly transitionService: CurrentTransitionService,
  ) {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  public clickNav(): void {
    this.layoutService.toggleSidebar();
  }

  protected viewTransitionName(): string {
    return this.transitionService.isTabChanged() ? '' : 'toolbar-tab';
  }
}
