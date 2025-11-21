import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

export const championshipResolver: ResolveFn<Championship | undefined> = () =>
  toObservable(inject(ApplicationService).requireCurrentTeam).pipe(
    map((team) => team.championship),
  );
