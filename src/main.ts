import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { MainComponent } from './app/layout/components/main/main.component';

void bootstrapApplication(MainComponent, appConfig);
