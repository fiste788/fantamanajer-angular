import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

import { TeamService } from '@data/services';
import { Team } from '@data/types';

export const teamResolver: ResolveFn<Team | undefined> = (route) => {
  const teamId = route.paramMap.get('team_id');
  const team = inject(Router).getCurrentNavigation()?.extras.state?.['team'] as Team | undefined;

  return team ?? (teamId === null ? undefined : inject(TeamService).getTeam(+teamId));
};
