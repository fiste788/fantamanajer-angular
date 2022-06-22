import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Breadcrumb } from './breadcrumb.model';
import { BreadcrumbService } from './breadcrumb.service';

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
export class BreadcrumbComponent {
  protected breadcrumbs$: Observable<Array<Breadcrumb>>;

  constructor(breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  protected track(index: number, crumb: Breadcrumb | null): string {
    return crumb !== null ? crumb.label : `${index}`;
  }
}
