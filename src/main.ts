import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void platformBrowserDynamic().bootstrapModule(AppModule).catch();
