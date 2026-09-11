import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { Router } from '@angular/router';

import type { Team } from '@data/interfaces';
import { TeamService } from '@data/services';

export const teamResolver: ResolveFn<Team | undefined> = (route) => {
  const teamId = route.paramMap.get('team_id');
  const team = inject(Router).currentNavigation()?.extras.state?.['team'] as Team | undefined;

  return team ?? (teamId === null ? undefined : inject(TeamService).getTeamById(+teamId));
};
