import { booleanAttribute, Component, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import {
  EcoFabSpeedDialActionsComponent,
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
} from '@ecodev/fab-speed-dial';

import { SeasonActiveDirective } from '@shared/directives';

import type { Direction } from '@ecodev/fab-speed-dial';

@Component({
  selector: 'app-fab',
  imports: [
    EcoFabSpeedDialActionsComponent,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SeasonActiveDirective,
  ],
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
})
export class FabComponent {

  public readonly direction = input<Direction>('up');
  public readonly extended = input(false, { transform: booleanAttribute });
  public readonly opened = model(false);

}
