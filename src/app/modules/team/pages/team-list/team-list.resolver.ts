import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { getRouteParam } from '@app/functions';
import { TeamService } from '@data/services';
import { Team } from '@data/types';

export const teamsResolver: ResolveFn<Array<Team> | undefined> = (route) => {
  const championshipId = getRouteParam<string>('championship_id', route);

  return championshipId === undefined ? undefined : inject(TeamService).getTeams(+championshipId);
};
