import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Article, PagedResponse } from '@shared/models';

const url = 'articles';
const routes = {
  articles: `/${url}`,
  article: (id: number) => `/${url}/${id}`,
  teamArticles: (id: number) => `/teams/${id}/${url}`,
  championshipArticles: (id: number) => `/champtionship/${id}/${url}`
};

@Injectable({ providedIn: 'root' })
export class ArticleService {

  constructor(private readonly http: HttpClient) { }

  getArticles(page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(location.pathname.substring(1), { params });
  }

  getArticlesByTeam(teamId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(routes.teamArticles(teamId), { params });
  }

  getArticlesByChampionship(championshipId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(routes.championshipArticles(championshipId), { params });
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(routes.article(id));
  }

  update(article: Article): Observable<any> {
    return this.http.put(routes.article(article.id), JSON.stringify(article));
  }

  create(article: Article): Observable<Article> {
    return this.http.post<Article>(routes.articles, JSON.stringify(article));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(routes.article(id));
  }
}
