/* eslint-disable unicorn/no-null */
import { ViewportScroller, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';
import { LayoutService } from '@layout/services';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

import { RellaxDirective } from '../../directives/rellax.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-parallax-header,app-parallax-header[tabs][tabPanel]',
  styleUrl: './parallax-header.component.scss',
  templateUrl: './parallax-header.component.html',
  imports: [
    RellaxDirective,
    MatTabsModule,
    NgOptimizedImage,
    SrcsetPipe,
    RouterLinkActive,
    RouterLink,
    SlugPipe,
  ],
})
export class ParallaxHeaderComponent implements OnDestroy {
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #viewportScroller = inject(ViewportScroller);

  public contextParam = input.required<string>();
  public placeholder = input<string>();
  public width = input(undefined, { transform: numberAttribute });
  public height = input(undefined, { transform: numberAttribute });
  public title = input('');
  public subtitle = input('');
  public image = input<string | null>(null);
  public backgroundImage = input<Record<string, string> | undefined>();
  public tabs = input<Array<Tab>>([]);
  public tabPanel = input<MatTabNavPanel>();
  public readonly imageLoaded = output<number>();

  public readonly rellaxRef = viewChild<RellaxDirective, ElementRef<HTMLElement>>('rellax', {
    read: ElementRef<HTMLElement>,
  });

  protected readonly navigationMode = inject(LayoutService).navigationMode;
  protected readonly visibleTabs = computed(() => this.tabs().filter((tab) => !tab.hidden));

  public ngOnDestroy(): void {
    this.rellaxRef()?.nativeElement.classList.remove('no-animate');
  }

  protected imageLoad(): void {
    this.#viewportScroller.scrollToAnchor('tab');
    this.rellaxRef()?.nativeElement.classList.add('no-animate');
  }

  protected track(_: number, item: Tab): string {
    return item.link;
  }

  protected viewTransitionName(transitionName = 'banner-img'): string {
    return this.#transitionService.isListToDetail(this.contextParam()) ? transitionName : '';
  }
}
