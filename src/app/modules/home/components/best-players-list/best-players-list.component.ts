import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { Member } from '@data/types';

@Component({
  selector: 'app-best-players-list',
  imports: [MatExpansionModule, MatListModule, RouterLink, DecimalPipe],
  styleUrl: './best-players-list.component.scss',
  templateUrl: './best-players-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestPlayersListComponent {
  public best_players = input.required<Array<Member>>();
}
