import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ClubService } from '@data/services';
import { Club } from '@data/types';

export const clubResolver: ResolveFn<Club | undefined> = (route) => {
  const clubId = route.paramMap.get('id');

  return clubId === null ? undefined : inject(ClubService).getClub(+clubId);
};
