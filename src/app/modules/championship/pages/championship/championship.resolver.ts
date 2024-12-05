import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

export const championshipResolver: ResolveFn<Championship | undefined> = async () => {
  return firstValueFrom(inject(ApplicationService).requireTeam$.pipe(map((t) => t.championship)), {
    defaultValue: undefined,
  });
};
