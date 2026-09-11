import { Component, input } from '@angular/core';

import type { Team } from '@data/interfaces';
import { TeamCardComponent } from '@modules/team/components/team-card/team-card.component';

@Component({
  imports: [TeamCardComponent],
  templateUrl: './team-list.page.html',
})
export class TeamListPage {

  public readonly teams = input.required<Team[]>();

}
