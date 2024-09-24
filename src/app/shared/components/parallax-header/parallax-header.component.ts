/* eslint-disable unicorn/no-null */
import {
  NgIf,
  NgFor,
  ViewportScroller,
  AsyncPipe,
  NgStyle,
  NgOptimizedImage,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';
import { SrcsetPipe } from '@shared/pipes';
import { LayoutService } from 'src/app/layout/services';

import { RellaxDirective } from '../../directives/rellax.directive';
import { SrcsetDirective } from '../../directives/srcset.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-parallax-header,app-parallax-header[tabs][tabPanel]',
  styleUrl: './parallax-header.component.scss',
  templateUrl: './parallax-header.component.html',
  standalone: true,
  imports: [
    RellaxDirective,
    SrcsetDirective,
    NgIf,
    MatTabsModule,
    NgOptimizedImage,
    NgFor,
    NgStyle,
    SrcsetPipe,
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
  ],
})
export class ParallaxHeaderComponent implements OnDestroy {
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #viewportScroller = inject(ViewportScroller);

  public contextParam = input.required<string>();
  public placeholder = input<string>();
  public title = input('');
  public subtitle = input('');
  public image = input<string | null>(null);
  public backgroundImage = input<Record<string, string> | undefined>();
  public tabs = input<Array<Tab>>([]);
  public tabPanel = input<MatTabNavPanel>();
  public readonly imageLoaded = output<number>();

  public readonly rellax = viewChild<RellaxDirective, ElementRef<HTMLElement>>('rellax', {
    read: ElementRef<HTMLElement>,
  });

  protected readonly isHandset$ = inject(LayoutService).isHandset$;

  public ngOnDestroy(): void {
    this.rellax()?.nativeElement.classList.remove('no-animate');
  }

  protected imageLoad(): void {
    // this.imageLoaded.emit((event.target as HTMLElement).clientHeight);
    this.#viewportScroller.scrollToAnchor('tab');
    this.rellax()?.nativeElement.classList.add('no-animate');
  }

  protected track(_: number, item: Tab): string {
    return item.link;
  }

  protected viewTransitionName() {
    return this.#transitionService.isOutletChanged('banner-img', this.contextParam());
  }
}
