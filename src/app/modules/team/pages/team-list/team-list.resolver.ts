import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { getRouteDataSnapshot } from '@app/functions';
import { TeamService } from '@data/services';
import { Team } from '@data/types';

export const teamsResolver: ResolveFn<Array<Team> | undefined> = (route) => {
  const championshipId = getRouteDataSnapshot<string>('championship_id', route);

  return championshipId === undefined ? undefined : inject(TeamService).getTeams(+championshipId);
};
