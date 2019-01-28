import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import * as Hammer from 'hammerjs';
import { SharedService } from '@app/shared/services/shared.service';
import { ScrollDownAnimation, ScrollUpAnimation, routerTransition } from '@app/core/animations';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'fm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    routerTransition,
    ScrollDownAnimation,
    ScrollUpAnimation
  ]
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) nav: MatSidenav;
  @ViewChild(MatSidenavContent) container: MatSidenavContent;
  @ViewChild(SpeedDialComponent) speedDial: SpeedDialComponent;
  @ViewChild(ToolbarComponent) toolbar: ToolbarComponent;
  @ViewChild('toolbar', { read: ElementRef }) toolbarEl: ElementRef;
  @ViewChild('pan', { read: ElementRef }) panEl: ElementRef;
  private disableScrollAnimation = false;
  public scrollDirection = 'up';
  private lastScrollTop = 0;
  private subscription: Subscription;

  constructor(
    public media: MediaObserver,
    public shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {

  }

  ngOnInit() {
    if (this.nav) {
      this.nav.autoFocus = false;
      if (this.media.isActive('lt-sm')) {
        this.nav.close();
      }
    }
    const hammertime = new Hammer(this.panEl.nativeElement, {});
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammertime.on('panright', (ev) => {
      this.nav.open();
    });
    hammertime.on('panleft', (ev) => {
      this.nav.close();
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.media.media$.subscribe((observer: MediaChange) => {
        if (observer.mqAlias === 'xs') {
          if (!this.subscription) {
            const el: HTMLElement = this.toolbarEl.nativeElement;
            this.subscription = this.applyScrollAnimation(el.clientHeight);
          }
        } else {
          this.scrollDirection = 'up';
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
          }
        }
      });
      this.toolbar.clickToggleNav.subscribe(() => this.nav.toggle());
    });
  }

  applyScrollAnimation(height = 0): Subscription {
    return this.container.elementScrolled().subscribe((scrolled: Event) => {
      const st = scrolled.srcElement.scrollTop;
      if (!this.disableScrollAnimation) {
        if (st > height && st !== this.lastScrollTop) {
          if (st > this.lastScrollTop) {
            this.setScrollDirection('down');
            this.speedDial.openSpeeddial = false;
          } else {
            this.setScrollDirection('up');
          }
          this.lastScrollTop = st;
        }
      } else {
        this.lastScrollTop = st;
      }
    });
  }

  private setScrollDirection(sd: string) {
    if (this.scrollDirection !== sd) {
      this.scrollDirection = sd;
      this.changeRef.detectChanges();
    }
  }

  scrollTo(x: number = 0, y: number = 0) {
    if (this.container.getElementRef().nativeElement.scrollTop === 0) {
      this.disableScrollAnimation = true;
      this.container.scrollTo({ top: y, left: x });
      this.disableScrollAnimation = false;
    }

  }

  closeSidenav() {
    if (this.nav && this.nav.mode === 'over') {
      this.nav.close();
    }
  }

  getState(outlet: RouterOutlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
    // return outlet.activatedRouteData.state;
  }
}
