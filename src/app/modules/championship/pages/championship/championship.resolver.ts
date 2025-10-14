import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

export const championshipResolver: ResolveFn<Championship | undefined> = () =>
  inject(ApplicationService).requireCurrentTeam().championship;
