import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  map,
  mergeMap,
  range,
  filter,
  EMPTY,
  concatMap,
} from 'rxjs';

import { StreamService } from '@data/services';
import { StreamActivity } from '@data/types';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
  private readonly length = 0;
  private readonly pageSize = 10;
  private readonly fetchedPages = new Set<number>();
  private cachedData: Array<StreamActivity | undefined>;
  private readonly dataStream: BehaviorSubject<Array<StreamActivity | undefined>>;
  private readonly subscription = new Subscription();

  constructor(
    private readonly streamService: StreamService,
    private readonly name: 'championships' | 'clubs' | 'teams' | 'users',
    private readonly id: number,
  ) {
    super();
    this.cachedData = Array.from<StreamActivity | undefined>({ length: this.length });
    this.addPlaceholder();
    this.dataStream = new BehaviorSubject<Array<StreamActivity | undefined>>(this.cachedData);
    this.dataStream.next(this.cachedData);
  }

  public connect(
    collectionViewer: CollectionViewer,
  ): Observable<Array<StreamActivity | undefined>> {
    this.subscription.add(
      collectionViewer.viewChange
        .pipe(
          concatMap((r) => this.getRange(r)),
          filter((page) => !this.fetchedPages.has(page)),
          mergeMap((page) => this.fetchPage(page)),
        )
        .subscribe((res) => this.dataStream.next(res)),
    );

    return this.dataStream;
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
  }

  get isEmpty(): boolean {
    return this.cachedData.length === 0;
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize) + 1;
  }

  private getRange(r: ListRange): Observable<number> {
    const startPage = this.getPageForIndex(r.start);
    const endPage = this.getPageForIndex(r.end - 1);

    return range(startPage, endPage - startPage + 1);
  }

  private fetchPage(page: number): Observable<Array<StreamActivity | undefined>> {
    if (this.fetchedPages.has(page)) {
      return EMPTY;
    }
    this.fetchedPages.add(page);

    return this.streamService.get(this.name, this.id, page).pipe(
      map((data) => data.results),
      map((res) => {
        this.cachedData = [...this.cachedData.filter((cd) => cd !== undefined), ...res];
        if (res.length === this.pageSize) {
          this.addPlaceholder();
        }

        return this.cachedData;
      }),
    );
  }

  private addPlaceholder(): void {
    this.cachedData = [...this.cachedData, ...Array.from<undefined>({ length: this.pageSize })];
  }
}
