import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';

import { ArticleService } from '@data/services';
import { Article, PagedResponse, Pagination } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./article-list.page.scss'],
  templateUrl: './article-list.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    DatePipe,
  ],
})
export class ArticleListPage implements OnInit {
  protected articles: Array<Article> = [];
  protected pagination?: Pagination;
  protected isLoading = false;
  private page = 1;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly articleService: ArticleService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  public async ngOnInit(): Promise<void> {
    return this.loadData();
  }

  protected async loadData(page = 1): Promise<void> {
    this.page = page;
    this.isLoading = true;

    return firstValueFrom(
      this.articleService.getArticles(page).pipe(
        map((data: PagedResponse<Array<Article>>) => {
          this.isLoading = false;
          this.pagination = data.pagination;
          this.articles = [...this.articles, ...data.data];
          this.changeRef.detectChanges();
        }),
      ),
      { defaultValue: undefined },
    );
  }

  protected onScrollDown(): void {
    if (this.pagination?.has_next_page && this.page < this.pagination.current_page + 1) {
      void this.loadData(this.pagination.current_page + 1);
    }
  }

  protected async delete(id: number): Promise<void> {
    return firstValueFrom(
      this.articleService.delete(id).pipe(
        map(() => {
          this.snackBar.open('Article deleted');
          this.articles.filter((article) => article.id !== id);
        }),
      ),
      { defaultValue: undefined },
    );
  }

  protected track(_: number, item: Article): number {
    return item.id; // or item.id
  }
}
