import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArticleService } from '@data/services';
import { cardCreationAnimation } from '@shared/animations';
import { Article, PagedResponse, Pagination } from '@data/types';
import { firstValueFrom, map } from 'rxjs';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./article-list.page.scss'],
  templateUrl: './article-list.page.html',
})
export class ArticleListPage implements OnInit {
  public articles: Array<Article> = [];
  public pagination?: Pagination;
  public isLoading = false;
  private page = 1;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly articleService: ArticleService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    void this.loadData();
  }

  public async loadData(page = 1): Promise<void> {
    this.page = page;
    this.isLoading = true;
    return firstValueFrom(
      this.articleService.getArticles(page).pipe(
        map((data: PagedResponse<Array<Article>>) => {
          this.isLoading = false;
          this.pagination = data.pagination;
          this.articles = this.articles.concat(data.data);
          this.changeRef.detectChanges();
        }),
      ),
    );
  }

  public onScrollDown(): void {
    if (this.pagination?.has_next_page && this.page < this.pagination.current_page + 1) {
      void this.loadData(this.pagination.current_page + 1);
    }
  }

  public async delete(id: number): Promise<void> {
    return firstValueFrom(
      this.articleService.delete(id).pipe(
        map(() => {
          this.snackBar.open('Article deleted', undefined, {
            duration: 3000,
          });
          this.articles.filter((article) => article.id !== id);
        }),
      ),
    );
  }

  public track(_: number, item: Article): number {
    return item.id; // or item.id
  }
}
