import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import 'rxjs/add/operator/share';

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

  delete(idx) {
    const article = this.articles[idx];
    const instance = this;
    this.articleService.delete(article.id).subscribe((res: any) => {
      instance.snackBar.open('Article deleted', null, {
        duration: 3000
      });
      this.articles = this.articles.filter(arr => {
        return article.filter(art => article.id !== art.id);
      });
    });
  }
}
