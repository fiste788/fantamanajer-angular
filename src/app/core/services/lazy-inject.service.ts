import type { ProviderToken } from '@angular/core';
import { inject, Injector, Service } from '@angular/core';

@Service()
export class LazyInjectService {

  private readonly _injector = inject(Injector);

  public async get<T>(providerLoader: () => Promise<ProviderToken<T>>): Promise<T> {
    return this._injector.get(await providerLoader());
  }

}
