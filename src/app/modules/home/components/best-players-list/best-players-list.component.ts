import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import type { Member } from '@data/interfaces';

@Component({
  selector: 'app-best-players-list',
  imports: [DecimalPipe, MatExpansionModule, MatListModule, RouterLink],
  templateUrl: './best-players-list.component.html',
  styleUrl: './best-players-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestPlayersListComponent {

  public readonly bestPlayers = input.required<Member[]>();

}
