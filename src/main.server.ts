import { bootstrapApplication } from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { MainComponent } from './app/layout/components';

const bootstrap = async () => bootstrapApplication(MainComponent, config);

export default bootstrap;
