import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Subscription, firstValueFrom, from, map } from 'rxjs';

import { ArticleService } from '@data/services';
import { Article, PagedResponse, Pagination } from '@data/types';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  templateUrl: './article-list.page.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    DatePipe,
  ],
})
export class ArticleListPage implements OnInit, OnDestroy {
  readonly #snackBar = inject(MatSnackBar);
  readonly #articleService = inject(ArticleService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #subscription = new Subscription();
  #page = 1;

  protected articles: Array<Article> = [];
  protected pagination?: Pagination;
  protected isLoading = false;

  public ngOnInit(): void {
    this.#subscription.add(from(this.loadData()).subscribe());
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  protected async loadData(page = 1): Promise<void> {
    this.#page = page;
    this.isLoading = true;

    return firstValueFrom(
      this.#articleService.getArticles(page).pipe(
        map((data: PagedResponse<Array<Article>>) => {
          this.isLoading = false;
          this.pagination = data.pagination;
          this.articles = [...this.articles, ...data.data];
          this.#changeRef.detectChanges();
        }),
      ),
      { defaultValue: undefined },
    );
  }

  protected onScrollDown(): void {
    if (this.pagination?.has_next_page && this.#page < this.pagination.current_page + 1) {
      void this.loadData(this.pagination.current_page + 1);
    }
  }

  protected async delete(id: number): Promise<void> {
    return firstValueFrom(
      this.#articleService.delete(id).pipe(
        map(() => {
          this.#snackBar.open('Article deleted');
          this.articles = this.articles.filter((article) => article.id !== id);
        }),
      ),
      { defaultValue: undefined },
    );
  }
}
