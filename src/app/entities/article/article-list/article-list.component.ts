import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { map, share } from 'rxjs/operators';
import { CardCreationAnimation } from 'app/shared/animations/card-creation.animation';

@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class ArticleListComponent implements OnInit {
  articles: Observable<Article[]>;

  constructor(
    public snackBar: MatSnackBar,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.articles = this.articleService.getArticles().pipe(share());
  }

  delete(id) {
    const instance = this;
    this.articleService.delete(id).subscribe((res: any) => {
      instance.snackBar.open('Article deleted', null, {
        duration: 3000
      });
      // this.articles.filter((x: Article[], idx) => x[idx] !== id);
      this.articles.pipe(
        map(articles => articles.filter(article => article.id !== id))
      );
    });
  }
}
