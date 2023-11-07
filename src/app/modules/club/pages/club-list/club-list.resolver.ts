import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ClubService } from '@data/services';
import { Club } from '@data/types';

export const clubsResolver: ResolveFn<Array<Club>> = () => {
  return inject(ClubService).getClubs();
};
