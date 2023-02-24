import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { TeamService } from '@data/services';
import { Team } from '@data/types';

export const teamResolver: ResolveFn<Team | undefined> = (route) => {
  const teamId = route.paramMap.get('team_id');

  return teamId === null ? undefined : inject(TeamService).getTeam(+teamId);
};
