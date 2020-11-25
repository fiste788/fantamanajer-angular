import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Article, PagedResponse } from '../types';

const url = 'articles';
const routes = {
  article: (id: number) => `/${url}/${id}`,
  articles: `/${url}`,
  championshipArticles: (id: number) => `/championship/${id}/${url}`,
  teamArticles: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class ArticleService {

  constructor(private readonly http: HttpClient) { }

  public getArticles(page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(location.pathname, { params });
  }

  public getArticlesByTeam(teamId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(routes.teamArticles(teamId), { params });
  }

  public getArticlesByChampionship(championshipId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(routes.championshipArticles(championshipId), { params });
  }

  public getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(routes.article(id));
  }

  public update(article: Article): Observable<{}> {
    return this.http.put(routes.article(article.id), article);
  }

  public create(article: Article): Observable<Partial<Article>> {
    return this.http.post(routes.articles, article);
  }

  public delete(id: number): Observable<{}> {
    return this.http.delete(routes.article(id));
  }
}
