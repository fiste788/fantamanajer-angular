import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { map, share } from 'rxjs/operators';
import { CardCreationAnimation } from 'app/shared/animations/card-creation.animation';
import { Pagination } from 'app/shared/pagination/pagination';
import { PagedResponse } from 'app/shared/pagination/paged-response';

@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  pagination: Pagination;
  public isLoading = false;
  private page = 1;

  constructor(
    public snackBar: MatSnackBar,
    private articleService: ArticleService
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
      }
    );

  }

  onScrollDown() {
    if (this.pagination.has_next_page && this.page < this.pagination.current_page + 1) {
      this.loadData(this.pagination.current_page + 1);
    }

  }

  delete(id) {
    const instance = this;
    this.articleService.delete(id).subscribe((res: any) => {
      instance.snackBar.open('Article deleted', null, {
        duration: 3000
      });
      // this.articles.filter((x: Article[], idx) => x[idx] !== id);
      this.articles.filter(article => article.id !== id);
    });
  }
}
