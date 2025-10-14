import { inject, Injectable, Injector, ProviderToken } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LazyInject {
  private readonly injector = inject(Injector);

  public async get<T>(providerLoader: () => Promise<ProviderToken<T>>): Promise<T> {
    return this.injector.get(await providerLoader());
  }
}
