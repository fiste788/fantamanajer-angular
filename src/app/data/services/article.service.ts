import type { HttpResourceRef } from '@angular/common/http';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { AtLeast } from '@app/interfaces';
import { WINDOW } from '@app/services/window.service';

import type { Article, PagedResponse } from '../interfaces';

const ARTICLES_URL_SEGMENT = 'articles'; // Modifica suggerita per la nomenclatura

const routes = {
  article: (id: number) => `/${ARTICLES_URL_SEGMENT}/${id}`,
  articles: `/${ARTICLES_URL_SEGMENT}`,
  championshipArticles: (id: number) => `/championship/${id}/${ARTICLES_URL_SEGMENT}`,
  teamArticles: (id: number) => `/teams/${id}/${ARTICLES_URL_SEGMENT}`,
};

@Service()
export class ArticleService {

  readonly #http = inject(HttpClient);
  readonly #window = inject<Window>(WINDOW);

  public create(article: Partial<Article>): Observable<AtLeast<Article, 'id'>> {
    return this.#http.post<AtLeast<Article, 'id'>>(routes.articles, article);
  }

  public delete(id: number): Observable<Record<string, never>> {
    return this.#http.delete<Record<string, never>>(routes.article(id));
  }

  public getArticle(id: number): Observable<Article> {
    return this.#http.get<Article>(routes.article(id));
  }

  public getArticles(page = 1): Observable<PagedResponse<Article[]>> {
    const parameters = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Article[]>>(this.#window.location.pathname, { params: parameters });
  }

  public getArticlesResource(page: () => number): HttpResourceRef<PagedResponse<Article[]> | undefined> {
    const parameters = this.#createPaginationParams(page()); // Utilizzo della funzione refactorizzata

    return httpResource(() => ({ params: parameters, url: this.#window.location.pathname }));
  }

  public getChampionshipArticles(
    // Modifica suggerita per la nomenclatura
    championshipId: number,
    page = 1,
  ): Observable<PagedResponse<Article[]>> {
    const parameters = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Article[]>>(routes.championshipArticles(championshipId), { params: parameters });
  }

  public getTeamArticles(teamId: number, page = 1): Observable<PagedResponse<Article[]>> {
    // Modifica suggerita per la nomenclatura
    const parameters = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Article[]>>(routes.teamArticles(teamId), { params: parameters });
  }

  public update(article: AtLeast<Article, 'id'>): Observable<Pick<Article, 'id'>> {
    return this.#http.put<Pick<Article, 'id'>>(routes.article(article.id), article);
  }

  // Funzione privata per creare i parametri di paginazione (Refactoring suggerito)
  #createPaginationParams(page: number): HttpParams {
    return new HttpParams().set('page', `${page}`);
  }

}
