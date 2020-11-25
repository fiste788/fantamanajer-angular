import { Component, OnInit } from '@angular/core';

import { ApplicationService, LayoutService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  selector: 'app-profile',
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  public photo?: string;

  constructor(
    public app: ApplicationService,
    private readonly layoutService: LayoutService,
  ) { }

  public ngOnInit(): void {
    this.loadPhoto(this.app.team);
  }

  public change(team: Team): void {
    this.app.teamChange$.next(team);
    this.loadPhoto(team);
    this.layoutService.closeSidebar();
  }

  public compareFn(t1: Team, t2: Team): boolean {
    return t1.id === t2.id;
  }

  public track(_: number, team: Team): number {
    return team.id;
  }

  private loadPhoto(team?: Team): void {
    if (team !== undefined && team.photo_url !== null) {
      this.photo = team.photo_url['240w'] ?? undefined;
    }
  }
}
