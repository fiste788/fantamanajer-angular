import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ScrollService } from '@app/services';
import { Tab } from '@shared/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-parallax-header',
  styleUrls: ['./parallax-header.component.scss'],
  templateUrl: './parallax-header.component.html',
})
export class ParallaxHeaderComponent {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public image: string | null;
  @Input() public backgroundImage: Record<string, string> | string | null;
  @Input() public tabs: Array<Tab> = [];

  public srcset = '';
  public width = 0;

  constructor(private readonly scrollService: ScrollService) {
  }

  public initialScroll(event: Event): void {
    this.scrollService.scrollTo(0, (event.target as HTMLElement).clientHeight - 300);
  }

  public track(_: number, item: Tab): string {
    return item.link;
  }
}
