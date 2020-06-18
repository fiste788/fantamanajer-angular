import { Component, OnInit } from '@angular/core';

import { ApplicationService, LayoutService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  photo?: string;

  constructor(
    public app: ApplicationService,
    private readonly layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.loadPhoto(this.app.team);
  }

  change(team: Team): void {
    this.app.teamChange$.next(team);
    this.loadPhoto(team);
    this.layoutService.closeSidebar();
  }

  compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  track(_: number, team: Team): number {
    return team.id;
  }

  private loadPhoto(team?: Team): void {
    if (team !== undefined && team.photo_url !== null) {
      this.photo = team.photo_url['240w'] ?? undefined;
    }
  }
}
