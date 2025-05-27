import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { inject, Injector, runInInjectionContext, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subscription,
  map,
  mergeMap,
  range,
  filter,
  EMPTY,
  concatMap,
  tap,
} from 'rxjs';

import { StreamService } from '@data/services';
import { StreamActivity } from '@data/types';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
  readonly #length = 0;
  #cachedData = Array.from<StreamActivity | undefined>({ length: this.#length });
  readonly #pageSize = 10;
  readonly #fetchedPages = new Set<number>();
  readonly #streamService: StreamService;
  readonly #dataStream: WritableSignal<Array<StreamActivity | undefined>>;
  readonly #dataStream$: Observable<Array<StreamActivity | undefined>>;
  readonly #subscription = new Subscription();

  constructor(
    private readonly injector: Injector,
    private readonly name: 'championships' | 'clubs' | 'teams' | 'users',
    private readonly id: number,
  ) {
    super();

    this.#addPlaceholder();
    this.#dataStream = signal(this.#cachedData);
    this.#streamService = runInInjectionContext(this.injector, () => inject(StreamService));
    this.#dataStream$ = runInInjectionContext(this.injector, () => toObservable(this.#dataStream));
  }

  public connect(
    collectionViewer: CollectionViewer,
  ): Observable<Array<StreamActivity | undefined>> {
    this.#subscription.add(
      collectionViewer.viewChange
        .pipe(
          concatMap((r) => this.#getRange(r)),
          filter((page) => !this.#fetchedPages.has(page)),
          mergeMap((page) => this.#fetchPage(page)),
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

  #fetchPage(page: number): Observable<Array<StreamActivity | undefined>> {
    if (this.#fetchedPages.has(page)) {
      return EMPTY;
    }
    this.#fetchedPages.add(page);

    return this.#streamService.find(this.name, this.id, page).pipe(
      map((data) => data.results),
      map((res) => {
        this.#cachedData = [...this.#cachedData.filter((cd) => cd !== undefined), ...res];
        if (res.length === this.#pageSize) {
          this.#addPlaceholder();
        }

        return this.#cachedData;
      }),
    );
  }

  #addPlaceholder(): void {
    this.#cachedData = [...this.#cachedData, ...Array.from<undefined>({ length: this.#pageSize })];
  }
}
