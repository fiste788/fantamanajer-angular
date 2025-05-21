import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from './breadcrumb.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.component.scss',
  templateUrl: './breadcrumb.component.html',
  imports: [MatIconModule, RouterLink, AsyncPipe],
})
export class BreadcrumbComponent {
  protected breadcrumbs$ = inject(BreadcrumbService).breadcrumbs$;
}
