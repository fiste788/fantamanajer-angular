import { trigger } from '@angular/animations';
import { CdkPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  Component,
  Injector,
  OnDestroy,
  afterNextRender,
  input,
  viewChild,
  inject,
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
  styleUrl: './toolbar-tab.component.scss',
  standalone: true,
  imports: [CdkPortal, MatTabsModule, RouterLinkActive, RouterLink, RouterOutlet, StatePipe],
})
export class ToolbarTabComponent implements OnDestroy {
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #appRef = inject(ApplicationRef);
  readonly #transitionService = inject(CurrentTransitionService);
  #portalHost?: PortalOutlet;

  public fragment = input<string>();
  public tabs = input<Array<Tab>>([]);
  protected portal = viewChild.required(CdkPortal);
  protected tabBar = viewChild(MatTabNav);

  constructor() {
    afterNextRender(() => {
      // Create a portalHost from a DOM element
      const element = this.#document.querySelector('#toolbar-tab-container');
      if (element) {
        this.#portalHost = new DomPortalOutlet(element, undefined, this.#appRef, this.#injector);
        this.#portalHost.attach(this.portal());
      }
    });
  }

  public ngOnDestroy(): void {
    this.#portalHost?.detach();
  }

  protected viewTransitionName() {
    return this.#transitionService.isTabChanged(this.tabBar()) ? 'tab' : '';
  }
}
