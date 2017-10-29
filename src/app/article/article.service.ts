import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Article } from './article';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class ArticleService {
  private url = 'articles';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private shared: SharedService
  ) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(location.pathname.substring(1));
  }

  getArticlesByTeam(team_id: number): Observable<Article[]> {
    return this.http.get<Article[]>('team/' + team_id + '/' + this.url);
  }

  getArticlesByChampionship(championship_id: number): Observable<Article[]> {
    return this.http.get<Article[]>(
      'championship/' + championship_id + '/' + this.url
    );
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(this.url + '/' + id);
  }

  update(article: Article): Observable<any> {
    const url = `${this.url}/${article.id}`;
    return this.http.put(url, JSON.stringify(article));
  }

  create(name: string): Observable<Article> {
    return this.http.post<Article>(
      this.url,
      JSON.stringify({
        name: name
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
