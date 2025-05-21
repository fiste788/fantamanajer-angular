import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { environment } from '@env';

import { appConfig } from './app.config';
import serverRoutes from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        [environment.serverApiEndpoint]: environment.apiEndpoint,
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
