import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from '@app/http';
import { cardCreationAnimation } from '@shared/animations/card-creation.animation';
import { Article, PagedResponse, Pagination } from '@shared/models';

@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  animations: [cardCreationAnimation]
})
export class ArticleListComponent implements OnInit {
  // @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';

  articles: Array<Article> = [];
  pagination: Pagination;
  isLoading = false;
  private page = 1;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly articleService: ArticleService,
    private readonly changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page = 1): void {
    this.page = page;
    this.isLoading = true;
    this.articleService.getArticles(page)
      .subscribe(
        (data: PagedResponse<Array<Article>>) => {
          this.isLoading = false;
          this.pagination = data.pagination;
          this.articles = this.articles.concat(data.data);
          this.changeRef.detectChanges();
        }
      );

  }

  onScrollDown(): void {
    if (this.pagination.has_next_page && this.page < this.pagination.current_page + 1) {
      this.loadData(this.pagination.current_page + 1);
    }

  }

  delete(id: number): void {
    this.articleService.delete(id)
      .subscribe(() => {
        this.snackBar.open('Article deleted', undefined, {
          duration: 3000
        });
        this.articles.filter(article => article.id !== id);
      });
  }

  track(_: number, item: Article): number {
    return item.id; // or item.id
  }
}
