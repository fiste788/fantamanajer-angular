import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';

import { ArticleService } from '@data/services';
import { ApplicationService } from '@app/services';
import { Article } from '@data/types';

@Component({
  styleUrls: ['./article-detail.page.scss'],
  templateUrl: './article-detail.page.html',
})
export class ArticleDetailPage implements OnInit {
  @ViewChild(NgForm) public articleForm: NgForm;

  public article$: Observable<Article>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly app: ApplicationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly articleService: ArticleService,
  ) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.params.id as string | undefined;
    this.article$ = id !== undefined ? this.load(+id) : this.new();
  }

  public load(id: number): Observable<Article> {
    return this.articleService.getArticle(id);
  }

  public new(): Observable<Article> {
    const article = new Article();
    article.team_id = this.app.team?.id ?? 0;

    return of(article);
  }

  public async save(article: Article): Promise<void> {
    if (this.articleForm.valid === true) {
      const save: Observable<Partial<Article>> = article.id
        ? this.articleService.update(article)
        : this.articleService.create(article);
      return firstValueFrom(
        save.pipe(
          map((a: Partial<Article>) => {
            this.snackBar.open('Articolo salvato correttamente', undefined, {
              duration: 3000,
            });
            void this.router.navigateByUrl(
              `/teams/${article.team_id}/articles#${a.id ?? article.id}`,
            );
          }),
        ),
      );
    }
  }
}
