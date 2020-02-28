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

  change(): void {
    this.layoutService.closeSidebar();
  }

  track(_: number, team: Team): number {
    return team.id;
  }
}
