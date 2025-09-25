import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  afterNextRender,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { StreamService } from '@data/services';
import { Stream, StreamActivity } from '@data/types';
import { LayoutService } from '@layout/services';
import { ContentLoaderComponent } from '@shared/components/content-loader';

@Component({
  imports: [ContentLoaderComponent, ScrollingModule, MatListModule, MatIconModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream',
  styleUrl: './stream.component.scss',
  templateUrl: './stream.component.html',
})
export class StreamComponent {
  readonly #layoutService = inject(LayoutService);
  readonly #streamService = inject(StreamService);
  readonly #fetchedPages = new Set<number>();
  readonly #pageSize = 10;
  readonly #page = signal(1);

  public context = input.required<'championships' | 'clubs' | 'teams' | 'users'>();
  public id = input.required({ transform: numberAttribute });

  protected readonly viewport = viewChild(CdkVirtualScrollViewport);
  protected readonly skeletonColors = this.#layoutService.skeletonColors;
  protected readonly width = signal(0);
  protected readonly stream = this.#streamService.getStreamResourceByContextAndId(
    this.context,
    this.id,
    this.#page,
  );

  protected readonly dataStream = this.#getDataStream();

  constructor() {
    afterNextRender(() => {
      const viewport = this.viewport();
      if (viewport) {
        this.width.set(viewport.elementRef.nativeElement.clientWidth);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackList(index: number, _item?: StreamActivity): number {
    return index;
  }

  public getPage(range: ListRange): void {
    const page = this.#getPageForIndex(range.end - 1);
    if (!this.#fetchedPages.has(page)) {
      this.#fetchedPages.add(page);
      this.#page.set(page);
    }
  }

  #getDataStream(): WritableSignal<Array<StreamActivity | undefined>> {
    return linkedSignal<Stream | undefined, Array<StreamActivity | undefined>>({
      source: () => this.stream.value(),
      computation: (source, previous) => {
        const currentValue = source?.results ?? this.#addPlaceholder();
        const cachedData = [
          ...(previous?.value?.filter((cd) => cd !== undefined) ?? []),
          ...currentValue,
        ];
        if (source?.next !== '') {
          return this.#addPlaceholder(cachedData);
        }

        return cachedData;
      },
    });
  }

  #getPageForIndex(index: number): number {
    return Math.floor(index / this.#pageSize) + 1;
  }

  #addPlaceholder(data: Array<StreamActivity | undefined> = []): Array<StreamActivity | undefined> {
    return [...data, ...Array.from<undefined>({ length: this.#pageSize })];
  }
}
