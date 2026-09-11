import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import type { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, numberAttribute, output, viewChild } from '@angular/core';
import type { MatTabNavPanel } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

import type { Tab } from '@data/interfaces';
import { LayoutService } from '@layout/services';
import { ListToDetailTransitionDirective, RellaxDirective } from '@shared/directives';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-parallax-header,app-parallax-header[tabs][tabPanel]',
  imports: [ListToDetailTransitionDirective, MatTabsModule, NgOptimizedImage, RellaxDirective, RouterLink, RouterLinkActive, SlugPipe, SrcsetPipe],
  templateUrl: './parallax-header.component.html',
  styleUrl: './parallax-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxHeaderComponent implements OnDestroy {

  readonly #viewportScroller = inject(ViewportScroller);
  protected readonly navigationMode = inject(LayoutService).navigationMode;

  public readonly backgroundImage = input<Record<string, string> | undefined>();
  public readonly contextParam = input.required<string>();
  public readonly height = input(undefined, { transform: numberAttribute });
  public readonly image = input<string | null>(null);
  public readonly imageLoaded = output<number>();
  public readonly placeholder = input<string>();
  public readonly rellaxRef = viewChild<RellaxDirective, ElementRef<HTMLElement>>('rellax', {
    read: ElementRef<HTMLElement>,
  });
  public readonly subtitle = input('');
  public readonly tabPanel = input<MatTabNavPanel>();
  public readonly tabs = input<Tab[]>([]);
  public readonly title = input('');
  public readonly width = input(undefined, { transform: numberAttribute });

  protected readonly visibleTabs = computed(() => this.tabs().filter(tab => !tab.hidden));

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

}
