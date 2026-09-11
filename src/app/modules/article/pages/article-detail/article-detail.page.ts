import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import type { Observable } from 'rxjs';

import { save } from '@app/functions';
import type { AtLeast } from '@app/interfaces';
import { AppService } from '@app/services';
import type { Article } from '@data/interfaces';
import { ArticleService } from '@data/services';

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.scss',
})
export class ArticleDetailPage {

  readonly #app = inject(AppService);
  readonly #articleService = inject(ArticleService);
  readonly #router = inject(Router);
  readonly #snackBar = inject(MatSnackBar);

  protected readonly article$ = this.getArticle();

  protected getArticle(): Observable<AtLeast<Article, 'team_id'>> {
    const id = inject(ActivatedRoute).snapshot.params['id'] as string | undefined;

    return id === undefined ? this.new() : this.load(+id);
  }

  protected load(id: number): Observable<Article> {
    return this.#articleService.getArticle(id);
  }

  protected new(): Observable<AtLeast<Article, 'team_id'>> {
    return of({ team_id: this.#app.requireCurrentTeam().id } satisfies AtLeast<Article, 'team_id'>);
  }

  protected async save(article: AtLeast<Article, 'team_id'>, articleForm: NgForm): Promise<boolean> {
    if (articleForm.valid) {
      const save$: Observable<AtLeast<Article, 'id'>> = article.id
        ? this.#articleService.update(article as AtLeast<Article, 'id'>)
        : this.#articleService.create(article);

      return save(save$, false, this.#snackBar, {
        callback: async result => this.#router.navigateByUrl(`/teams/${article.team_id}/articles#${result.id}`),
        message: 'Articolo salvato correttamente',
      });
    }

    return false;
  }

}
