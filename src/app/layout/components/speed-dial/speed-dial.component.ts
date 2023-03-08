import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
} from '@ecodev/fab-speed-dial';

import { ApplicationService } from '@app/services';

import { SeasonActiveDirective } from '../../../shared/directives/season-active.directive';

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

  constructor(protected readonly app: ApplicationService) {}

  public close(): void {
    this.openSpeeddial = false;
  }
}
