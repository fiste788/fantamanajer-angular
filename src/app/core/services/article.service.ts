import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly url = 'articles';

  constructor(private readonly http: HttpClient) { }

  getArticles(page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(location.pathname.substring(1), { params });
  }

  getArticlesByTeam(teamId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(`teams/${teamId}/${this.url}`, { params });
  }

  getArticlesByChampionship(championshipId: number, page = 1): Observable<PagedResponse<Array<Article>>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Array<Article>>>(
      `championships/${championshipId}/${this.url}`
      , { params });
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.url}/${id}`);
  }

  update(article: Article): Observable<any> {
    const url = `${this.url}/${article.id}`;

    return this.http.put(url, JSON.stringify(article));
  }

  create(article: Article): Observable<Article> {
    return this.http.post<Article>(this.url, JSON.stringify(article));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
