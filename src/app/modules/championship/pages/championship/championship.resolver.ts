import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { ResolveFn } from '@angular/router';

import { map, take } from 'rxjs';

import { AppService } from '@app/services';
import type { Championship } from '@data/interfaces';

export const championshipResolver: ResolveFn<Championship | undefined> = () => {
  const appService = inject(AppService);
  const teamSignal = appService.requireCurrentTeam;

  return toObservable(teamSignal).pipe(
    // filterNil(),
    map(team => team.championship),
    take(1),
  );
};
