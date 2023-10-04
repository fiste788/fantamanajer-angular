import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription, firstValueFrom, tap } from 'rxjs';

import { StreamService } from '@data/services';
import { Stream, StreamActivity } from '@data/types';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
  public isEmpty = false;
  private readonly length = 0;
  private readonly pageSize = 10;
  private readonly fetchedPages = new Set<number>();
  private cachedData: Array<StreamActivity | undefined>;
  private readonly dataStream: BehaviorSubject<Array<StreamActivity | undefined>>;
  private readonly subscription = new Subscription();

  constructor(
    private readonly streamService: StreamService,
    private readonly name: 'teams' | 'users' | 'clubs' | 'championships',
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
          tap(async (range) => {
            console.log(range);
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end);
            for (let i = startPage; i <= endPage; i += 1) {
              await this.fetchPage(i + 1);
            }
          }),
        )
        .subscribe(),
    );

    return this.dataStream;
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private async fetchPage(page: number): Promise<Stream | undefined> {
    if (this.fetchedPages.has(page) || page === 0) {
      return undefined;
    }
    this.fetchedPages.add(page);

    return firstValueFrom(
      this.streamService.get(this.name, this.id, page).pipe(
        tap((data: Stream) => {
          this.cachedData = [...this.cachedData.filter((it) => it !== undefined), ...data.results];
          if (this.cachedData.length === 0) {
            this.isEmpty = true;
          }
          this.dataStream.next(this.cachedData);
        }),
      ),
      { defaultValue: undefined },
    );
  }

  private addPlaceholder(): void {
    this.cachedData = [...this.cachedData, ...Array.from<undefined>({ length: this.pageSize })];
  }
}
