import type { AngularProviderConfig } from './angular-provider-config.interface';

export type ConfigFragment<K extends keyof AngularProviderConfig> = Pick<AngularProviderConfig, K>;
