import type { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import type { WritableSignal } from '@angular/core';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, linkedSignal, numberAttribute, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import type { Stream, StreamActivity } from '@data/interfaces';
import { StreamService } from '@data/services';
import { LayoutService } from '@layout/services';
import { ContentLoaderComponent } from '@shared/components/content-loader';

@Component({
  selector: 'app-stream',
  imports: [ContentLoaderComponent, DatePipe, MatIconModule, MatListModule, ScrollingModule],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamComponent {

  readonly #layoutService = inject(LayoutService);
  readonly #streamService = inject(StreamService);

  public readonly context = input.required<'championships' | 'clubs' | 'teams' | 'users'>();
  public readonly id = input.required({ transform: numberAttribute });

  protected readonly dataStream = this.#getDataStream();
  protected readonly skeletonColors = this.#layoutService.skeletonColors;

  readonly #page = signal(1);

  protected readonly stream = this.#streamService.getStreamResourceByContextAndId(this.context, this.id, this.#page);
  protected readonly viewport = viewChild(CdkVirtualScrollViewport);
  protected readonly width = signal(0);

  readonly #fetchedPages = new Set<number>();
  readonly #pageSize = 10;

  constructor() {
    afterNextRender(() => {
      const viewport = this.viewport();
      if (viewport) {
        this.width.set(viewport.elementRef.nativeElement.clientWidth);
      }
    });
  }

  public getPage(range: ListRange): void {
    const page = this.#getPageForIndex(range.end - 1);
    if (!this.#fetchedPages.has(page)) {
      this.#fetchedPages.add(page);
      this.#page.set(page);
    }
  }

  public trackList(index: number): number {
    return index;
  }

  #addPlaceholder(data: (StreamActivity | undefined)[] = []): (StreamActivity | undefined)[] {
    return [...data, ...Array.from<undefined>({ length: this.#pageSize })];
  }

  #getDataStream(): WritableSignal<(StreamActivity | undefined)[]> {
    return linkedSignal<Stream | undefined, (StreamActivity | undefined)[]>({
      computation: (source, previous) => {
        const currentValue = source?.results ?? this.#addPlaceholder();
        const cachedData = [...previous?.value.filter(cd => cd !== undefined) ?? [], ...currentValue];

        if (source?.next !== '') {
          return this.#addPlaceholder(cachedData);
        }

        return cachedData;
      },
      source: () => this.stream.value(),
    });
  }

  #getPageForIndex(index: number): number {
    return Math.floor(index / this.#pageSize) + 1;
  }

}
