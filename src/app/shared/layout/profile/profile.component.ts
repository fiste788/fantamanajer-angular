import { Component } from '@angular/core';
import { Team } from '@app/core/models';
import { ApplicationService, LayoutService } from '@app/core/services';

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

  change(): void {
    this.layoutService.closeSidebar();
  }

  track(_: number, team: Team): number {
    return team.id;
  }
}
