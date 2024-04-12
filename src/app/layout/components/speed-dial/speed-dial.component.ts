import { AsyncPipe } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
  Direction,
} from '@ecodev/fab-speed-dial';

import { SeasonActiveDirective } from '@shared/directives';

@Component({
  selector: 'app-speed-dial',
  styleUrl: './speed-dial.component.scss',
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
  @Input({ transform: booleanAttribute }) public extended = false;
  @Input() public direction: Direction = 'up';
  protected openSpeeddial = false;

  constructor(private readonly router: Router) {}

  public close(): void {
    this.openSpeeddial = false;
  }

  public async navigate(url: string): Promise<boolean> {
    return this.router.navigateByUrl(url);
  }
}
