import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Article } from './article';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ArticleService {
    private articlesUrl = 'articles';
    private headers = new Headers({ 'Accept': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private config: AppConfig,
          private route: ActivatedRoute,
          private http: AuthHttp,
          private shared: SharedService) {}


    getArticles(): Promise<Article[]> {
        return this.http.get(this.config.get('apiEndpoint') + window.location.pathname.substring(1), this.options)
            .toPromise()
            .then(response => response.json().data as Article[])
            .catch(this.shared.handleError);
    }


    getArticle(id: number): Promise<Article> {
        const url = `${this.config.get('apiEndpoint') + this.articlesUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Article)
            .catch(this.shared.handleError);
    }

    update(article: Article): Promise<any> {
        const url = `${this.config.get('apiEndpoint') + this.articlesUrl}/${article.id}`;
        return this.http
            .put(url, JSON.stringify(article))
            .toPromise()
            .then(response => response.json())
            .catch(this.shared.handleError);
    }

    create(name: string): Promise<Article> {
        return this.http
            .post(this.config.get('apiEndpoint') + this.articlesUrl, JSON.stringify({
                name: name
            }))
            .toPromise()
            .then(res => res.json().data as Article)
            .catch(this.shared.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.config.get('apiEndpoint') + this.articlesUrl}/${id}`;
        return this.http.delete(url)
            .toPromise()
            .then(() => null)
            .catch(this.shared.handleError);
    }

}
