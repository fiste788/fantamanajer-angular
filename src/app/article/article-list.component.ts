import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { Article } from './article';
import { ArticleService } from './article.service';


@Component({
  selector: 'fm-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  articles: Article[] = [];

  constructor(public snackBar: MdSnackBar,
    private articleService: ArticleService) { }

  ngOnInit(): void {
    this.articleService.getArticles()
      .then(articles => this.articles = articles.slice(0, 5));
  }

  delete(idx) {
    console.log(idx)
    const article = this.articles[idx];
    const instance = this;
    this.articleService.delete(article.id).then(function(response) {
      instance.snackBar.open('Article deleted', null, {
        duration: 3000
      });
      instance.articles.splice(idx, 1)
    });
  }

}
