import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { getRouteParam } from '@app/functions';
import type { Team } from '@data/interfaces';
import { TeamService } from '@data/services';

export const teamsResolver: ResolveFn<Team[] | undefined> = (route) => {
  const championshipId = getRouteParam<string>('championship_id', route);

  return championshipId === undefined ? undefined : inject(TeamService).getChampionshipTeams(+championshipId);
};
