import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
} from '@ecodev/fab-speed-dial';

import { SeasonActiveDirective } from '@shared/directives';

@Component({
  selector: 'app-speed-dial',
  styleUrls: ['./speed-dial.component.scss'],
  templateUrl: './speed-dial.component.html',
  standalone: true,
  imports: [
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    MatButtonModule,
    MatIconModule,
    EcoFabSpeedDialActionsComponent,
    SeasonActiveDirective,
    MatTooltipModule,
    RouterLink,
    AsyncPipe,
  ],
})
export class SpeedDialComponent {
  protected openSpeeddial = false;

  constructor(private readonly router: Router) {}

  public close(): void {
    this.openSpeeddial = false;
  }

  public navigate(url: string): Promise<boolean> {
    return this.router.navigateByUrl(url);
  }
}
