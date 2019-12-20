import { Component, OnInit, HostBinding, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article, Pagination, PagedResponse } from '@app/core/models';
import { ArticleService } from '@app/core/services/article.service';
import { cardCreationAnimation } from '@app/core/animations/card-creation.animation';

@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  animations: [cardCreationAnimation]
})
export class ArticleListComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  articles: Article[] = [];
  pagination: Pagination;
  public isLoading = false;
  private page = 1;

  constructor(
    public snackBar: MatSnackBar,
    private articleService: ArticleService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page = 1) {
    this.page = page;
    this.isLoading = true;
    this.articleService.getArticles(page).subscribe(
      (data: PagedResponse<Article[]>) => {
        this.isLoading = false;
        this.pagination = data.pagination;
        this.articles = this.articles.concat(data.data);
        this.changeRef.detectChanges();
      }
    );

  }

  onScrollDown() {
    if (this.pagination.has_next_page && this.page < this.pagination.current_page + 1) {
      this.loadData(this.pagination.current_page + 1);
    }

  }

  delete(id: number) {
    const instance = this;
    this.articleService.delete(id).subscribe((res: any) => {
      instance.snackBar.open('Article deleted', undefined, {
        duration: 3000
      });
      // this.articles.filter((x: Article[], idx) => x[idx] !== id);
      this.articles.filter(article => article.id !== id);
    });
  }
}
