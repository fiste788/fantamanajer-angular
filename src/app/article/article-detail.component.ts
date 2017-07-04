import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Article } from './article';
import { ArticleService } from './article.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'fm-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'absolute';

  article: Article;

  constructor(public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.articleService.getArticle(id).then(article => this.article = article);
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
  cancel() {
    this.closePopup();
  }

  closePopup() {
    // Providing a `null` value to the named outlet
    // clears the contents of the named outlet
    this.router.navigate([{ outlets: { popup: null }}]);
  }

}

