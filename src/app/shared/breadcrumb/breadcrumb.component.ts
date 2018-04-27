import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBreadcrumb } from 'ngx-breadcrumbs';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { McBreadcrumbsService } from 'ngx-breadcrumbs';

@Component({
  selector: 'fm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  crumbs: IBreadcrumb[];
  subscriptions = new Array<Subscription>();

  constructor(
    public bs: McBreadcrumbsService,
    public ts: Title,
  ) { }

  ngOnInit(): void {

    const s = this.bs.crumbs$.subscribe((x) => {
      this.crumbs = x;
      this.ts.setTitle(['FantaManajer'].concat(x.map((value) => value.text)).join(' - '));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

}
