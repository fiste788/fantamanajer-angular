import { Component, booleanAttribute, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
  Direction,
} from '@ecodev/fab-speed-dial';

import { SeasonActiveDirective } from '@shared/directives';

@Component({
  selector: 'app-fab',
  styleUrl: './fab.component.scss',
  templateUrl: './fab.component.html',
  imports: [
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    MatButtonModule,
    MatIconModule,
    EcoFabSpeedDialActionsComponent,
    SeasonActiveDirective,
    MatTooltipModule,
    RouterModule,
  ],
})
export class FabComponent {
  public extended = input(false, { transform: booleanAttribute });
  public direction = input<Direction>('up');
  public opened = model(false);
}
