import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { save } from '@app/functions';
import { ArticleService } from '@data/services';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './article-list.page.html',
})
export class ArticleListPage {

  readonly #articleService = inject(ArticleService);
  readonly #snackBar = inject(MatSnackBar);

  readonly #page = signal(1);

  protected resource = this.#articleService.getArticlesResource(this.#page);

  protected readonly articles = computed(() => this.resource.value()?.data ?? []);

  protected async delete(id: number): Promise<void> {
    return save(this.#articleService.delete(id), undefined, this.#snackBar, {
      message: 'Articolo cancellato',
    });
  }

  protected onScrollDown(): void {
    const resource = this.resource.value();
    if (
      resource?.pagination.has_next_page
      && this.#page() < resource.pagination.current_page + 1
    ) {
      this.#page.update(page => page + 1);
    }
  }

}
