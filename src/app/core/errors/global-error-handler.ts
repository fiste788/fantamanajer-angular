import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, NgZone, Provider } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { firstValueFrom, tap } from 'rxjs';

import { WINDOW } from '@app/services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly snackbar: MatSnackBar,
    private readonly zone: NgZone,
  ) {}

  public handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
      this.zone.run(() => {
        const ref = this.snackbar.open(
          error.message || 'Undefined client error',
          'Ricarica pagina',
          { duration: 5000 },
        );
        void firstValueFrom(ref.onAction().pipe(tap(() => this.window.location.reload())), {
          defaultValue: undefined,
        });
      });

      // eslint-disable-next-line no-console
      console.error('Error from global error handler', error);
    }
  }
}

export const globalErrorHandlerProvider: Provider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
};
