import { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { MainComponent } from './app/layout/components/main/main.component';

const bootstrap = async (): Promise<ApplicationRef> => bootstrapApplication(MainComponent, config);

export default bootstrap;
