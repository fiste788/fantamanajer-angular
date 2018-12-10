import { BehaviorSubject, Subscription, Observable, bindCallback } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { StreamService } from './stream.service';
import { Stream } from './stream';
import { StreamActivity } from './stream-activity';

export class StreamDataSource extends DataSource<StreamActivity | undefined> {
    private length = 0;
    private pageSize = 10;
    private cachedData = Array.from<StreamActivity>({ length: this.length });
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(StreamActivity | undefined)[]>(this.cachedData);
    private subscription = new Subscription();

    constructor(private streamService: StreamService, private name: 'teams' | 'users' | 'clubs' | 'championships', private id: number) {
        super();
        this.fetchPage(1);
    }

    connect(collectionViewer: CollectionViewer): Observable<(StreamActivity | undefined)[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
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
        }

        this.streamService.get(this.name, this.id, page).subscribe((data: Stream) => {
            this.cachedData = this.cachedData.filter(it => it != null).concat(data.results);
            if (data.results.length) {
                this.addPlaceholder();
            }
            this.dataStream.next(this.cachedData);
        });
    }

    private addPlaceholder() {
        for (let i = 0; i < this.pageSize; i++) {
            this.cachedData.push(null);
        }
    }
}
