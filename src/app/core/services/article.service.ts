import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/services';
import { Observable } from 'rxjs';
import { Article, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private url = 'articles';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private shared: SharedService
  ) { }

  getArticles(page = 1): Observable<PagedResponse<Article[]>> {
    const params = new HttpParams().set('page', `${page}`);
    return this.http.get<PagedResponse<Article[]>>(location.pathname.substring(1), { params: params });
  }

  getArticlesByTeam(team_id: number, page = 1): Observable<PagedResponse<Article[]>> {
    const params = new HttpParams().set('page', `${page}`);
    return this.http.get<PagedResponse<Article[]>>('teams/' + team_id + '/' + this.url, { params: params });
  }

  getArticlesByChampionship(championship_id: number, page = 1): Observable<PagedResponse<Article[]>> {
    const params = new HttpParams().set('page', `${page}`);
    return this.http.get<PagedResponse<Article[]>>(
      'championships/' + championship_id + '/' + this.url
      , { params: params });
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(this.url + '/' + id);
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
