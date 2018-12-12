import { Component, Input, ViewChild, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { MainComponent } from '@app/shared/layout/main/main.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollDispatcher } from '@angular/cdk/overlay';

@Component({
  selector: 'fm-parallax-header',
  templateUrl: './parallax-header.component.html',
  styleUrls: ['./parallax-header.component.scss']
})
export class ParallaxHeaderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public image: string;
  @Input() public backgroundImage: any;
  // @Input() public backgroundUrls: any;
  @Input() public tabs: any[] = [];
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public srcset = '';
  public width = 0;
  public scrollTarget: Element;
  private subscription: Subscription;

  constructor(public main: MainComponent, private router: Router, private scroller: ScrollDispatcher) {
    this.subscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.selectTabFromUrl();
      }
    });
    this.scrollTarget = this.scroller.scrollContainers.keys().next().value.getElementRef().nativeElement;
  }

  ngOnChanges(changes) {
    this.selectTabFromUrl();
    if (this.backgroundImage) {
      if (typeof this.backgroundImage !== 'string') {
        const srcset = [];
        const keys = Object.keys(this.backgroundImage);
        keys.forEach(key => {
          srcset.push(this.backgroundImage[key] + ' ' + key);
        });
        this.srcset = srcset.join(',');
        const lastKey = keys.pop();
        this.backgroundImage = this.backgroundImage[lastKey];
        this.width = parseInt(lastKey.substring(0, lastKey.indexOf('w')), 10);
      }
    } else {
      this.srcset = '';
      this.width = 0;
    }
  }

  selectTabFromUrl() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
    }
  }

  initialScroll(event: Event) {
    this.main.scrollTo(0, event.srcElement.clientHeight - 300);
  }

  ngAfterViewInit() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
