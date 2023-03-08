import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Inject, Injectable, NgZone, Provider } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, tap } from 'rxjs';

import { WINDOW } from '@app/services';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(@Inject(WINDOW) private readonly window: Window) {}

  public handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
      inject(NgZone).run(() => {
        const ref = inject(MatSnackBar).open(
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
  deps: [MatSnackBar, NgZone],
};
