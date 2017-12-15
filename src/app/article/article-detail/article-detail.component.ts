import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../shared/shared.service';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'fm-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: Article;
  @ViewChild(NgForm) articleForm: NgForm;

  constructor(
    public snackBar: MatSnackBar,
    private shared: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      const id = parseInt(this.route.snapshot.params['id'], 10);
      this.articleService
        .getArticle(id)
        .subscribe(article => (this.article = article));
    } else {
      this.article = new Article();
      this.article.team_id = this.shared.currentTeam.id;
    }
  }

  cancel() { }

  save() {
    if (this.articleForm.valid) {
      let observable = null;
      if (this.article.id) {
        observable = this.articleService.update(this.article);
      } else {
        observable = this.articleService.create(this.article);
      }
      observable.subscribe(article => {
        this.snackBar.open('Articolo salvato correttamente', null, {
          duration: 3000
        });
        this.router.navigateByUrl(
          '/teams/' + this.article.team_id + '/articles#' + article.id
        );
      });
    }
  }
}
