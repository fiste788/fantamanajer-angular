import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { first, map } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

export const championshipResolver: ResolveFn<Championship | undefined> = () => {
  return inject(ApplicationService).requireTeam$.pipe(
    map((t) => t.championship),
    first(),
  );
};
