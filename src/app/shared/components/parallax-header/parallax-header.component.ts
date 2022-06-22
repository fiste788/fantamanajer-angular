import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Tab } from '@data/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-parallax-header',
  styleUrls: ['./parallax-header.component.scss'],
  templateUrl: './parallax-header.component.html',
})
export class ParallaxHeaderComponent {
  @Input() public title = '';
  @Input() public subtitle = '';
  @Input() public image?: string | null;
  @Input() public backgroundImage?: Record<string, string> | string | null;
  @Input() public tabs: Array<Tab> = [];
  @Output() public readonly imageLoaded = new EventEmitter<number>();

  protected imageLoad(event: Event): void {
    this.imageLoaded.emit((event.target as HTMLElement).clientHeight);
  }

  protected track(_: number, item: Tab): string {
    return item.link;
  }
}
