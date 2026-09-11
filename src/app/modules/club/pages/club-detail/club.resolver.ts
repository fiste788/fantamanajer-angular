import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import type { Club } from '@data/interfaces';
import { ClubService } from '@data/services';

export const clubResolver: ResolveFn<Club | undefined> = (route) => {
  const clubId = route.paramMap.get('id');

  return clubId === null ? undefined : inject(ClubService).getClub(+clubId);
};
