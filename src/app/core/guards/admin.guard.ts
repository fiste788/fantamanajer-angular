import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { AuthenticationService } from '@app/authentication';

export const adminGuard: CanActivateFn = () => inject(AuthenticationService).currentUser()?.admin ?? false;
