import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
    this.dataStream = new BehaviorSubject<Array<StreamActivity | undefined>>(this.cachedData);
    // this.dataStream.pipe(tap(() => this.cd.detectChanges()));
    this.fetchPage(1);
  }

  public connect(
    collectionViewer: CollectionViewer,
  ): Observable<Array<StreamActivity | undefined>> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end);
        for (let i = startPage; i <= endPage; i += 1) {
          this.fetchPage(i + 1);
        }
      }),
    );

    return this.dataStream;
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page) || page === 0) {
      return;
    }
    this.fetchedPages.add(page);
    if (page === 1) {
      this.addPlaceholder();
      this.dataStream.next(this.cachedData);
    }

    this.subscription.add(
      this.streamService.get(this.name, this.id, page).subscribe((data: Stream) => {
        this.cachedData = [...this.cachedData.filter((it) => it !== undefined), ...data.results];
        if (this.cachedData.length === 0) {
          this.isEmpty = true;
        }
        this.dataStream.next(this.cachedData);
      }),
    );
  }

  private addPlaceholder(): void {
    this.cachedData = [...this.cachedData, ...Array.from<undefined>({ length: this.pageSize })];
  }
}
