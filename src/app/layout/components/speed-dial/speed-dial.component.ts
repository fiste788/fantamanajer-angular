import { Component, booleanAttribute, input, inject, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
  Direction,
} from '@ecodev/fab-speed-dial';

import { SeasonActiveDirective } from '@shared/directives';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-speed-dial',
  styleUrl: './speed-dial.component.scss',
  templateUrl: './speed-dial.component.html',
  imports: [
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    MatButtonModule,
    MatIconModule,
    EcoFabSpeedDialActionsComponent,
    SeasonActiveDirective,
    MatTooltipModule,
  ],
})
export class SpeedDialComponent {
  readonly #router = inject(Router);
  readonly #layoutService = inject(LayoutService);

  public extended = input(false, { transform: booleanAttribute });
  public direction = input<Direction>('up');
  protected openSpeeddial = false;

  constructor() {
    effect(() => {
      if (this.#layoutService.down() && !this.extended()) {
        this.openSpeeddial = false;
      }
    });
  }

  protected async navigate(url: string): Promise<boolean> {
    return this.#router.navigate([url]);
  }
}
