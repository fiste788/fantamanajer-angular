import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, Subscription, map, range, filter, concatMap, tap } from 'rxjs';

import { StreamService } from '@data/services';
import { StreamActivity } from '@data/types';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
  readonly #length = 10;
  #cachedData = Array.from<StreamActivity | undefined>({ length: this.#length });
  readonly #pageSize = 10;
  readonly #fetchedPages = new Set<number>();
  readonly #streamService: StreamService;
  readonly #dataStream = signal(this.#cachedData);
  readonly #dataStream$ = toObservable(this.#dataStream);
  readonly #subscription = new Subscription();

  constructor(
    private readonly injector: Injector,
    private readonly name: () => 'championships' | 'clubs' | 'teams' | 'users',
    private readonly id: () => number,
  ) {
    super();

    this.#addPlaceholder();
    this.#streamService = runInInjectionContext(this.injector, () => inject(StreamService));
  }

  public connect(
    collectionViewer: CollectionViewer,
  ): Observable<Array<StreamActivity | undefined>> {
    this.#subscription.add(
      collectionViewer.viewChange
        .pipe(
          concatMap((r) => this.#getRange(r)),
          filter((page) => !this.#fetchedPages.has(page)),
          map((page) => this.#fetchPage(page)),
          tap((res) => this.#dataStream.set(res)),
        )
        .subscribe(),
    );

    return this.#dataStream$;
  }

  public disconnect(): void {
    this.#subscription.unsubscribe();
  }

  get isEmpty(): boolean {
    return this.#cachedData.length === 0;
  }

  #getPageForIndex(index: number): number {
    return Math.floor(index / this.#pageSize) + 1;
  }

  #getRange(r: ListRange): Observable<number> {
    const startPage = this.#getPageForIndex(r.start);
    const endPage = this.#getPageForIndex(r.end - 1);

    return range(startPage, endPage - startPage + 1);
  }

  #fetchPage(page: number): Array<StreamActivity | undefined> {
    if (this.#fetchedPages.has(page)) {
      return [];
    }
    this.#fetchedPages.add(page);

    const res = this.#streamService.getStreamResourceByContextAndId(this.name, this.id, page);

    if (res.hasValue()) {
      const items = res.value().results;
      this.#cachedData = [...this.#cachedData.filter((cd) => cd !== undefined), ...items];
      if (items.length === this.#pageSize) {
        this.#addPlaceholder();
      }
    }

    return this.#cachedData;
  }

  #addPlaceholder(): void {
    this.#cachedData = [...this.#cachedData, ...Array.from<undefined>({ length: this.#pageSize })];
  }
}
