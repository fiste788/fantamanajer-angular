import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { map, take } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

export const championshipResolver: ResolveFn<Championship | undefined> = () => {
  const applicationService = inject(ApplicationService);
  const teamSignal = applicationService.requireCurrentTeam;

  return toObservable(teamSignal).pipe(
    map((team) => team.championship),
    take(1),
  );
};
