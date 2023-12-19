import { NgIf, NgFor, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Tab } from '@data/types';

import { RellaxDirective } from '../../directives/rellax.directive';
import { SrcsetDirective } from '../../directives/srcset.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-parallax-header,app-parallax-header[tabs][tabPanel]',
  styleUrls: ['./parallax-header.component.scss'],
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
  ],
})
export class ParallaxHeaderComponent {
  @Input({ required: true }) public contextParam!: string;
  @Input() public title = '';
  @Input() public subtitle = '';
  @Input() public image?: string | null;
  @Input() public backgroundImage?: Record<string, string> | string | null;
  @Input() public tabs: Array<Tab> = [];
  @Input() public tabPanel?: MatTabNavPanel;
  @Output() public readonly imageLoaded = new EventEmitter<number>();

  private readonly transitionService = inject(CurrentTransitionService);
  private readonly viewportScroller = inject(ViewportScroller);

  protected imageLoad(): void {
    // this.imageLoaded.emit((event.target as HTMLElement).clientHeight);
    this.viewportScroller.scrollToAnchor('tab');
  }

  protected track(_: number, item: Tab): string {
    return item.link;
  }

  protected viewTransitionName() {
    return this.transitionService.isOutletChanged(this.contextParam);
  }
}
