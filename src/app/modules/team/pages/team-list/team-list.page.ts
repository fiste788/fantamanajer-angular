import { Component, input } from '@angular/core';

import { Team } from '@data/types';
import { TeamCardComponent } from '@modules/team/components/team-card/team-card.component';

@Component({
  templateUrl: './team-list.page.html',
  imports: [TeamCardComponent],
})
export class TeamListPage {
  protected readonly teams = input.required<Array<Team>>();
}
