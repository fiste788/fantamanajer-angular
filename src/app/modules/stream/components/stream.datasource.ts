import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { StreamService } from '@app/core/services';
import { Stream, StreamActivity } from '@app/core/models';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
  private length = 0;
  private pageSize = 10;
  private cachedData = Array.from<StreamActivity | undefined>({ length: this.length });
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(StreamActivity | undefined)[]>(this.cachedData);
  private subscription = new Subscription();
  public isEmpty = false;

  constructor(
    private streamService: StreamService,
    private name: 'teams' | 'users' | 'clubs' | 'championships',
    private id: number
  ) {
    super();
    this.fetchPage(1);
  }

  connect(collectionViewer: CollectionViewer): Observable<(StreamActivity | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i + 1);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page) || page === 0) {
      return;
    }
    this.fetchedPages.add(page);
    if (page === 1) {
      this.addPlaceholder();
      this.dataStream.next(this.cachedData);
    }

    this.streamService.get(this.name, this.id, page).subscribe((data: Stream) => {
      this.cachedData = this.cachedData.filter(it => it !== undefined).concat(data.results);
      if (this.cachedData.length === 0) {
        this.isEmpty = true;
      }
      this.dataStream.next(this.cachedData);
    });
  }

  private addPlaceholder() {
    this.cachedData = [...this.cachedData, ...Array(this.pageSize).fill(undefined)];
    /*for (let i = 0; i < this.pageSize; i++) {
      this.cachedData.push(null);
    }*/
  }
}
