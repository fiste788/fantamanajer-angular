import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import type { Club } from '@data/interfaces';
import { ClubService } from '@data/services';

export const clubsResolver: ResolveFn<Club[]> = () => inject(ClubService).getClubs();
