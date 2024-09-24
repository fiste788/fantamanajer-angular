import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        'https://api.fantamanajer.it': '/api',
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
