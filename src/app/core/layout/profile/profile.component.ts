import { Component } from '@angular/core';

import { ApplicationService, LayoutService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    public app: ApplicationService,
    private readonly layoutService: LayoutService
  ) { }

  change(team: Team): void {
    this.app.teamChange$.next(team);
    this.layoutService.closeSidebar();
  }

  compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  track(_: number, team: Team): number {
    return team.id;
  }
}
