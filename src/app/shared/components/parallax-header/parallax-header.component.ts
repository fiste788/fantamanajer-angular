import { Component, Input, ViewChild, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { MainComponent } from '@app/shared/layout/main/main.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

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

  constructor(public main: MainComponent, private router: Router) {
  }


  initialScroll(event: Event) {
    this.main.scrollTo(0, (event.target as any).clientHeight - 300);
  }
}
