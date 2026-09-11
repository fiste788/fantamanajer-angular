import type { PortalOutlet } from '@angular/cdk/portal';
import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import type { OnDestroy } from '@angular/core';
import { afterNextRender, ApplicationRef, Component, DOCUMENT, ElementRef, inject, Injector, input, viewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ScrollService } from '@app/services';
import type { Tab } from '@data/interfaces';
import { TabChangedTransitionDirective } from '@shared/directives';

@Component({
  selector: 'app-primary-tab',
  imports: [CdkPortal, MatTabsModule, RouterLink, RouterLinkActive, RouterOutlet, TabChangedTransitionDirective],
  templateUrl: './primary-tab.component.html',
  styleUrl: './primary-tab.component.scss',
})
export class PrimaryTabComponent implements OnDestroy {

  readonly #appRef = inject(ApplicationRef);
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #scrollService = inject(ScrollService);

  public readonly fragment = input<string>();
  public readonly tabs = input<Tab[]>([]);

  protected readonly portal = viewChild.required(CdkPortal);
  protected readonly tabBar = viewChild('tabBarRef', { read: ElementRef<HTMLElement> });

  #portalHost?: PortalOutlet;

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
