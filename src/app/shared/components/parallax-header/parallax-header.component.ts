import { Component, Input } from '@angular/core';
import { ScrollService } from '@app/core/services/scroll.service';

@Component({
  selector: 'fm-parallax-header',
  templateUrl: './parallax-header.component.html',
  styleUrls: ['./parallax-header.component.scss']
})
export class ParallaxHeaderComponent {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public image: string;
  @Input() public backgroundImage: any;
  @Input() public tabs: any[] = [];
  public srcset = '';
  public width = 0;

  constructor(public scrollService: ScrollService) {
  }


  initialScroll(event: Event) {
    this.scrollService.scrollTo(0, (event.target as any).clientHeight - 300);
  }
}
