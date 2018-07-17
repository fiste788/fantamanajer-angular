import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { ScrollDownAnimation } from '../../shared/animations/scroll-down.animation';
import { ScrollUpAnimation } from '../../shared/animations/scroll-up.animation';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'fm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    ScrollDownAnimation,
    ScrollUpAnimation
  ]
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) nav: MatSidenav;
  @ViewChild(MatSidenavContent) container: MatSidenavContent;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  @ViewChild(SpeedDialComponent) speedDial: SpeedDialComponent;
  @ViewChild(ToolbarComponent) toolbar: ToolbarComponent;
  @ViewChild('toolbar', { read: ElementRef }) toolbarEl: ElementRef;
  scrollDirection = 'up';
  private lastScrollTop = 0;
  private subscription: Subscription;

  constructor(
    public media: ObservableMedia,
    public shared: SharedService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.nav && this.media.isActive('lt-sm')) {
      this.nav.close();
    }
  }

  ngAfterViewInit() {
    this.media.asObservable().subscribe(observer => {
      if ((!this.subscription || this.subscription.closed) && (observer.mqAlias === 'sm' || observer.mqAlias === 'xs')) {
        this.applyScrollAnimation();
      } else if (this.subscription) {
        this.scrollDirection = 'up';
        this.subscription.unsubscribe();
      }
    });
    this.toolbar.clickToggleNav.subscribe(() => this.nav.toggle());
  }

  applyScrollAnimation() {
    this.subscription = this.scrollable.elementScrolled().subscribe((scrolled: Event) => {
      const st = scrolled.srcElement.scrollTop;
      const el: HTMLElement = this.toolbarEl.nativeElement;
      if (st > el.clientHeight && st !== this.lastScrollTop) {
        if (st > this.lastScrollTop) {
          this.scrollDirection = 'down';
          this.speedDial.openSpeeddial = false;
        } else {
          this.scrollDirection = 'up';
        }
        this.lastScrollTop = st;
        this.changeRef.detectChanges();
      }
    });
  }

  closeSidenav() {
    if (this.nav && this.media.isActive('xs')) {
      this.nav.close();
    }
  }
}
