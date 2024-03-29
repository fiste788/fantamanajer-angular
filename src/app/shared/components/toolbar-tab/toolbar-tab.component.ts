import { trigger } from '@angular/animations';
import { CdkPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';
import { routerTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  selector: 'app-toolbar-tab',
  templateUrl: './toolbar-tab.component.html',
  styleUrls: ['./toolbar-tab.component.scss'],
  standalone: true,
  imports: [
    CdkPortal,
    NgIf,
    MatTabsModule,
    NgFor,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    StatePipe,
    AsyncPipe,
    NgClass,
  ],
})
export class ToolbartTabComponent implements AfterViewInit, OnDestroy {
  @Input() public fragment?: string;
  public tabs = input([] as Array<Tab>);
  protected portal = viewChild.required(CdkPortal);
  protected tabBar = viewChild(MatTabNav);
  private portalHost?: PortalOutlet;

  constructor(
    private readonly injector: Injector,
    private readonly appRef: ApplicationRef,
    private readonly transitionService: CurrentTransitionService,
  ) {}

  public ngAfterViewInit(): void {
    // Create a portalHost from a DOM element
    const element = document.querySelector('#toolbar-tab-container');
    if (element) {
      this.portalHost = new DomPortalOutlet(element, undefined, this.appRef, this.injector);
      this.portalHost.attach(this.portal());
    }
  }

  public ngOnDestroy(): void {
    this.portalHost?.detach();
  }

  protected viewTransitionName() {
    return this.transitionService.isTabChanged(this.tabBar()) ? 'tab' : '';
  }
}
