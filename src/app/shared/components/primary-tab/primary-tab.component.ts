import { CdkPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  Injector,
  OnDestroy,
  afterNextRender,
  input,
  viewChild,
  inject,
  DOCUMENT,
} from '@angular/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';

@Component({
  selector: 'app-primary-tab',
  templateUrl: './primary-tab.component.html',
  styleUrl: './primary-tab.component.scss',
  imports: [CdkPortal, MatTabsModule, RouterLinkActive, RouterLink, RouterOutlet],
})
export class PrimaryTabComponent implements OnDestroy {
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
      const element = this.#document.querySelector('#primary-tab-container');
      if (element) {
        this.#portalHost = new DomPortalOutlet(element, this.#appRef, this.#injector);
        this.#portalHost.attach(this.portal());
      }
    });
  }

  public ngOnDestroy(): void {
    this.#portalHost?.detach();
  }

  protected viewTransitionName(): string {
    return this.#transitionService.isTabChanged(this.tabBar()) ? 'tab' : '';
  }
}
