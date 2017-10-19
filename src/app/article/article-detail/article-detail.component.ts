import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'fm-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  article: Article;

  constructor(public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.articleService.getArticle(id).then(article => this.article = article);
  }

  cancel() {

  }

  save() {
    delete this.article.created_at;
    this.articleService.update(this.article).then(response => {
      this.snackBar.open(response.message, null, {
        duration: 3000
      });
      if (response.article) {
        this.article = <Article>response.article;
      }
      console.log(response.errors);
    })
  }
}

