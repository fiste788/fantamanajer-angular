import { ApplicationRef } from '@angular/core';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { MainComponent } from './app/layout/components/main/main.component';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> =>
  bootstrapApplication(MainComponent, config, context);

export default bootstrap;
