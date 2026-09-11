import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [MatIconModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {

  protected breadcrumbs = inject(BreadcrumbService).breadcrumbs;

}
