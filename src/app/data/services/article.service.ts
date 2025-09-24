import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AtLeast } from '@app/types';

import { Article, PagedResponse } from '../types';

const ARTICLES_URL_SEGMENT = 'articles'; // Modifica suggerita per la nomenclatura

const routes = {
  article: (id: number) => `/${ARTICLES_URL_SEGMENT}/${id}`,
  articles: `/${ARTICLES_URL_SEGMENT}`,
  championshipArticles: (id: number) => `/championship/${id}/${ARTICLES_URL_SEGMENT}`,
  teamArticles: (id: number) => `/teams/${id}/${ARTICLES_URL_SEGMENT}`,
};

@Injectable({ providedIn: 'root' })
export class ArticleService {
  readonly #http = inject(HttpClient);

  public getArticles(page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Array<Article>>>(location.pathname, { params });
  }

  public getArticlesResource(
    page: () => number,
  ): HttpResourceRef<PagedResponse<Array<Article>> | undefined> {
    const params = this.#createPaginationParams(page()); // Utilizzo della funzione refactorizzata

    return httpResource(() => ({ url: location.pathname, params }));
  }

  public getTeamArticles(teamId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    // Modifica suggerita per la nomenclatura
    const params = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Array<Article>>>(routes.teamArticles(teamId), { params });
  }

  public getChampionshipArticles(
    // Modifica suggerita per la nomenclatura
    championshipId: number,
    page = 1,
  ): Observable<PagedResponse<Array<Article>>> {
    const params = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<PagedResponse<Array<Article>>>(
      routes.championshipArticles(championshipId),
      { params },
    );
  }

  public getArticle(id: number): Observable<Article> {
    return this.#http.get<Article>(routes.article(id));
  }

  public update(article: AtLeast<Article, 'id'>): Observable<Pick<Article, 'id'>> {
    return this.#http.put<Pick<Article, 'id'>>(routes.article(article.id), article);
  }

  public create(article: Partial<Article>): Observable<AtLeast<Article, 'id'>> {
    return this.#http.post<AtLeast<Article, 'id'>>(routes.articles, article);
  }

  public delete(id: number): Observable<Record<string, never>> {
    return this.#http.delete<Record<string, never>>(routes.article(id));
  }

  // Funzione privata per creare i parametri di paginazione (Refactoring suggerito)
  #createPaginationParams(page: number): HttpParams {
    return new HttpParams().set('page', `${page}`);
  }
}
