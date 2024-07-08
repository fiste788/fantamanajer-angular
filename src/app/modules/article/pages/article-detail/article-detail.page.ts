import { NgIf, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { AtLeast } from '@app/types';
import { ArticleService } from '@data/services';
import { Article } from '@data/types';

@Component({
  styleUrl: './article-detail.page.scss',
  templateUrl: './article-detail.page.html',
  standalone: true,
  imports: [NgIf, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AsyncPipe],
})
export class ArticleDetailPage {
  readonly #snackBar = inject(MatSnackBar);
  readonly #app = inject(ApplicationService);
  readonly #router = inject(Router);
  readonly #articleService = inject(ArticleService);

  protected readonly article$ = this.getArticle();

  protected getArticle(): Observable<Article> {
    const id = inject(ActivatedRoute).snapshot.params['id'] as string | undefined;

    return id === undefined ? this.new() : this.load(+id);
  }

  protected load(id: number): Observable<Article> {
    return this.#articleService.getArticle(id);
  }

  protected new(): Observable<Article> {
    return this.#app.requireTeam$.pipe(map((t) => ({ team_id: t.id }) as Article));
  }

  protected async save(
    article: AtLeast<Article, 'team_id'>,
    articleForm: NgForm,
  ): Promise<boolean> {
    if (articleForm?.valid) {
      const save$: Observable<AtLeast<Article, 'id'>> = article.id
        ? this.#articleService.update(article as AtLeast<Article, 'id'>)
        : this.#articleService.create(article);

      return firstValueFrom(
        save$.pipe(
          map(async (a: AtLeast<Article, 'id'>) => {
            this.#snackBar.open('Articolo salvato correttamente');

            return this.#router.navigateByUrl(`/teams/${article.team_id}/articles#${a.id}`);
          }),
        ),
        { defaultValue: false },
      );
    }

    return false;
  }
}
