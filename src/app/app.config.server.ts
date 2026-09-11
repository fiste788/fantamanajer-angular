import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { ENVIRONMENT } from '@env';

import { provideServerErrorHandler } from '@data/services/ssr';

import { APP_CONFIG } from './app.config';
import serverRoutes from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerErrorHandler(),
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        [ENVIRONMENT.serverApiEndpoint]: ENVIRONMENT.apiEndpoint,
      },
    },
  ],
};

export const SERVER_CONFIG = mergeApplicationConfig(APP_CONFIG, serverConfig);
