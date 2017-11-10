import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: Observable<Article[]>;

  constructor(
    public snackBar: MatSnackBar,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.articles = this.articleService.getArticles().share();
  }

  delete(id) {
    const instance = this;
    this.articleService.delete(id).subscribe((res: any) => {
      instance.snackBar.open('Article deleted', null, {
        duration: 3000
      });
      // this.articles.filter((x: Article[], idx) => x[idx] !== id);
      this.articles.map(articles =>
        articles.filter(article => article.id !== id)
      );
    });
  }
}
