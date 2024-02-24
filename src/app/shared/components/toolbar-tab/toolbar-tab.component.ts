import { trigger } from '@angular/animations';
import { CdkPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, map, pairwise, switchMap, tap } from 'rxjs';

import { filterNil } from '@app/functions';
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
  public readonly direction$: Observable<string>;
  protected portal = viewChild.required(CdkPortal);
  protected tabBar = viewChild(MatTabNav);
  private portalHost?: PortalOutlet;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly appRef: ApplicationRef,
    private readonly transitionService: CurrentTransitionService,
  ) {
    this.direction$ = toObservable(this.tabBar).pipe(
      tap((it) => console.log('aaa', it)),
      filterNil(),
      switchMap((tab) => tab.selectFocusedIndex),
      tap((it) => console.log('bbb', it)),
      pairwise(),
      map(([p, c]) => (p < c ? 'left' : 'right')),
    );
  }

  public ngAfterViewInit(): void {
    // Create a portalHost from a DOM element
    const element = document.querySelector('#toolbar-tab-container');
    if (element) {
      this.portalHost = new DomPortalOutlet(
        element,
        this.componentFactoryResolver,
        this.appRef,
        this.injector,
      );
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
