import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { BestPlayer } from '@modules/home/types/best-players';

@Component({
  selector: 'app-best-players-list',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, RouterLink, DecimalPipe],
  templateUrl: './best-players-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestPlayersListComponent {
  public best_players = input.required<BestPlayer>();
}
