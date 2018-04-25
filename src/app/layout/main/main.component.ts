import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../shared/auth/auth.service';
import { ScrollDownAnimation } from '../../shared/animations/scroll-down.animation';
import { ScrollUpAnimation } from '../../shared/animations/scroll-up.animation';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs/Subscription';

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
  scrollDirection = 'up';
  private lastScrollTop = 0;
  private subscription: Subscription;

  constructor(
    public media: ObservableMedia,
    public shared: SharedService,
    public auth: AuthService,
    private changeRef: ChangeDetectorRef
  ) {
    this.shared.initialize();
  }

  ngOnInit() {
    if (this.media.isActive('lt-sm') && this.nav) {
      this.nav.close();
    }
  }

  ngAfterViewInit() {
    this.media.asObservable().subscribe(observer => {
      if (observer.mqAlias === 'sm' || observer.mqAlias === 'xs') {
        this.applyScrollAnimation();
      } else if (this.subscription) {
        this.scrollDirection = 'up';
        this.subscription.unsubscribe();
      }
    });

  }

  applyScrollAnimation() {
    this.subscription = this.scrollable.elementScrolled().subscribe((scrolled: Event) => {
      const st = scrolled.srcElement.scrollTop;
      if (st > this.lastScrollTop) {
        this.scrollDirection = 'down';
      } else {
        this.scrollDirection = 'up';
      }
      this.lastScrollTop = st;
      this.changeRef.detectChanges();
    });
  }

  closeSidenav() {
    if (this.media.isActive('xs') && this.nav) {
      this.nav.close();
    }
  }
}
