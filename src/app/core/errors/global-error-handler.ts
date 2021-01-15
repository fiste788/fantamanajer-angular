import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WINDOW } from '@app/services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly snackbar: MatSnackBar,
    private readonly zone: NgZone,
  ) {}

  handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
      this.zone.run(() => {
        const ref = this.snackbar.open(
          error.message || 'Undefined client error',
          'Ricarica pagina',
        );
        ref.onAction().subscribe(() => this.window.location.reload());
      });

      console.error('Error from global error handler', error);
    }
  }
}
