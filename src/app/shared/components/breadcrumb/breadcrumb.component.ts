import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IBreadcrumb, NgxBreadcrumbsService } from 'ngx-breadcrumbs/dist/ngx-breadcrumbs';
import { Subscription } from 'rxjs';

export const breadcrumbTransition = trigger('breadcrumbTransition', [
  transition('* => *', [
    query(':enter', style({ transform: 'translateX(100%)', opacity: 0 }), { optional: true }),
    sequence([
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)', opacity: 1 }),
          animate(
            '500ms cubic-bezier(.75,-0.48,.26,1.52)',
            style({ transform: 'translateX(-100%)', opacity: 0 }),
          ),
        ],
        { optional: true },
      ),
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate(
            '500ms cubic-bezier(.75,-0.48,.26,1.52)',
            style({ transform: 'translateX(0%)', opacity: 1 }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);

@Component({
  animations: [breadcrumbTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumb',
  styleUrls: ['./breadcrumb.component.scss'],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  public crumbs: Array<IBreadcrumb> = [];
  public subscriptions = new Array<Subscription>();

  constructor(
    private readonly bs: NgxBreadcrumbsService,
    private readonly ts: Title,
    private readonly cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.loadBreadcrumb();
  }

  public loadBreadcrumb(): void {
    this.subscriptions.push(
      this.bs.crumbs$.subscribe((x) => {
        if (x.length === 0) {
          const def: IBreadcrumb = { text: 'FantaManajer', path: '/' };
          x.push(def);
        }
        if (
          x.length &&
          this.crumbs.length &&
          this.crumbs.map((a) => a.text).join('') !== x.map((a) => a.text).join('')
        ) {
          this.crumbs = [];
          this.cd.detectChanges();
        }
        this.crumbs = x;
        this.cd.detectChanges();
        this.setTitle(x);
      }),
    );
  }

  public setTitle(x: Array<IBreadcrumb>): void {
    const title = x.map((value) => value.text);
    if (x.length > 0 && title[0] !== 'FantaManajer') {
      title.unshift('FantaManajer');
    }
    this.ts.setTitle(title.join(' - '));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }

  public track(index: number, crumb: IBreadcrumb | null): string {
    return crumb !== null ? crumb.text : `${index}`;
  }
}
