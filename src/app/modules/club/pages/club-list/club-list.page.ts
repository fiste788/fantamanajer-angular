import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ClubService } from '@data/services';
import { Club } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./club-list.page.scss'],
  templateUrl: './club-list.page.html',
})
export class ClubListPage {
  protected readonly clubs$?: Observable<Array<Club>>;

  constructor(private readonly clubService: ClubService) {
    this.clubs$ = this.clubService.getClubs();
  }

  public track(_: number, club: Club): number {
    return club.id;
  }
}
