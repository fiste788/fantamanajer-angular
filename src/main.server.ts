import type { ApplicationRef } from '@angular/core';
import type { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';

import { SERVER_CONFIG } from './app/app.config.server';
import { MainComponent } from './app/layout/components/main/main.component';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> => bootstrapApplication(MainComponent, SERVER_CONFIG, context);

export default bootstrap;
