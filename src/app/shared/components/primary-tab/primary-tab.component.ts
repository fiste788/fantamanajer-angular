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
  ElementRef,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ScrollService } from '@app/services';
import { Tab } from '@data/types';
import { TabChangedTransitionDirective } from '@shared/directives';

@Component({
  selector: 'app-primary-tab',
  templateUrl: './primary-tab.component.html',
  styleUrl: './primary-tab.component.scss',
  imports: [
    CdkPortal,
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    TabChangedTransitionDirective,
  ],
})
export class PrimaryTabComponent implements OnDestroy {
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #appRef = inject(ApplicationRef);
  readonly #scrollService = inject(ScrollService);
  #portalHost?: PortalOutlet;

  public fragment = input<string>();
  public tabs = input<Array<Tab>>([]);
  protected portal = viewChild.required(CdkPortal);
  protected tabBar = viewChild('tabBarRef', { read: ElementRef<HTMLElement> });

  constructor() {
    afterNextRender(() => {
      // Create a portalHost from a DOM element
      const element = this.#document.querySelector('#primary-tab-container');
      if (element) {
        this.#portalHost = new DomPortalOutlet(element, this.#appRef, this.#injector);
        this.#portalHost.attach(this.portal());
        this.#scrollService.updateOffset();
      }
    });
  }

  public ngOnDestroy(): void {
    this.#portalHost?.detach();
    this.#scrollService.updateOffset();
  }
}
