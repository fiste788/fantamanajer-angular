// src/app/services/notification.service.ts
import { inject, Injectable } from '@angular/core';
import {
  type MatSnackBarRef,
  type TextOnlySnackBar,
  type MatSnackBar,
  type MatSnackBarConfig,
} from '@angular/material/snack-bar';

import { LazyInject } from './lazy-inject.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly lazyInjector = inject(LazyInject);

  public async open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig,
  ): Promise<MatSnackBarRef<TextOnlySnackBar>> {
    if (config?.duration === undefined) {
      config = { ...config, duration: 3000 }; // Default duration of 3 seconds
    }
    // Lazy load MatSnackBar to avoid initial bundle size increase
    // and to ensure that Angular Material is only loaded when needed.
    const snackBar = await this.lazyInjector.get<MatSnackBar>(async () => {
      // Carica dinamicamente il modulo.
      // `await` qui attende che l'import sia completato.
      const module = await import('@angular/material/snack-bar');

      // Restituisce la classe MatSnackBar dal modulo caricato.
      return module.MatSnackBar;
    });

    return snackBar.open(message, action, config);
  }
}
