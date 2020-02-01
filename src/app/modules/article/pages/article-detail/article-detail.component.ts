import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from '@app/core/models';
import { ApplicationService, ArticleService } from '@app/core/services';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'fm-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: Observable<Article>;
  @ViewChild(NgForm) articleForm: NgForm;

  constructor(
    public snackBar: MatSnackBar,
    private app: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      const id = parseInt(this.route.snapshot.params.id, 10);
      this.article = this.articleService.getArticle(id);
    } else {
      const article = new Article();
      if (this.app.team) {
        article.team_id = this.app.team.id;
      }
      this.article = of(article);
    }
  }

  cancel() { }

  save(article: Article) {
    if (this.articleForm.valid) {
      let observable = null;
      if (article.id) {
        observable = this.articleService.update(article);
      } else {
        observable = this.articleService.create(article);
      }
      observable.subscribe(() => {
        this.snackBar.open('Articolo salvato correttamente', undefined, {
          duration: 3000
        });
        this.router.navigateByUrl(
          '/teams/' + article.team_id + '/articles#' + article.id
        );
      });
    }
  }
}
