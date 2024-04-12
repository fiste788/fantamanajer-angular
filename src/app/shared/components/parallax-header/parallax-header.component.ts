import { NgIf, NgFor, ViewportScroller, AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';
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
    NgFor,
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
  ],
})
export class ParallaxHeaderComponent implements OnDestroy {
  @ViewChild('rellax') public readonly rellax?: ElementRef<HTMLElement>;
  @Input({ required: true }) public contextParam!: string;
  @Input() public title = '';
  @Input() public subtitle = '';
  @Input() public image?: string | null;
  @Input() public backgroundImage?: Record<string, string> | string | null;
  @Input() public tabs: Array<Tab> = [];
  @Input() public tabPanel?: MatTabNavPanel;
  @Output() public readonly imageLoaded = new EventEmitter<number>();

  protected readonly isHandset$ = inject(LayoutService).isHandset$;
  private readonly transitionService = inject(CurrentTransitionService);
  private readonly viewportScroller = inject(ViewportScroller);

  public ngOnDestroy(): void {
    this.rellax?.nativeElement.classList.remove('no-animate');
  }

  protected imageLoad(): void {
    // this.imageLoaded.emit((event.target as HTMLElement).clientHeight);
    this.viewportScroller.scrollToAnchor('tab');
    this.rellax?.nativeElement.classList.add('no-animate');
  }

  protected track(_: number, item: Tab): string {
    return item.link;
  }

  protected viewTransitionName() {
    return this.transitionService.isOutletChanged('banner-img', this.contextParam);
  }
}
