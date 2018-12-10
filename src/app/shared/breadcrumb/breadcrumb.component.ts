import { Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IBreadcrumb, McBreadcrumbsService } from 'ngx-breadcrumbs-ui';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { trigger, transition, style, sequence, animate, query } from '@angular/animations';

export const breadcrumbTransition = trigger('breadcrumbTransition', [
  transition('* => *', [
    // query(':enter, :leave', style({ position: 'absolute', width: '100%', top: 0 })),
    query(':enter', style({ transform: 'translateX(100%)', opacity: 0 }), { optional: true }),
    sequence([
      query(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
          style({ transform: 'translateX(0%)', opacity: 1 })),
      ], { optional: true })

    ])
  ])
]);


@Component({
  selector: 'fm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  animations: [breadcrumbTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  crumbs: IBreadcrumb[];
  subscriptions = new Array<Subscription>();

  constructor(
    public bs: McBreadcrumbsService,
    public ts: Title,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.bs.crumbs$.subscribe((x) => {
      if (x.length === 0) {
        const def: IBreadcrumb = { text: 'FantaManajer', path: '/' };
        x.push(def);
      }
      if (x && x.length && this.crumbs && this.crumbs.length && this.crumbs.map(a => a.text).join('') !== x.map(a => a.text).join('')) {
        this.crumbs = [];
        this.cd.detectChanges();
      }
      this.crumbs = x;
      this.cd.detectChanges();
      this.setTitle(x);
    }));
  }

  setTitle(x: IBreadcrumb[]) {
    const title = x.map(value => value.text);
    if (x.length > 0 && title[0] !== 'FantaManajer') {
      title.unshift('FantaManajer');
    }
    this.ts.setTitle(title.join(' - '));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  track(index, crumb) {
    return crumb ? crumb.text : index;
  }

}
