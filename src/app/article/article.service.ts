import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Article } from './article';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ArticleService {
    private url = 'articles';

    constructor(private route: ActivatedRoute,
          private http: HttpClient,
          private shared: SharedService) {}


    getArticles(): Promise<Article[]> {
        return this.http.get<Article[]>(this.url)
            .toPromise()
            .catch(this.shared.handleError.bind(this));
    }


    getArticle(id: number): Promise<Article> {
        return this.http.get<Article>(this.url + '/' + id)
            .toPromise()
            // .catch(this.shared.handleError);
    }

    update(article: Article): Promise<any> {
        const url = `${this.url}/${article.id}`;
        return this.http
            .put(url, JSON.stringify(article))
            .toPromise()
            // .catch(this.shared.handleError);
    }

    create(name: string): Promise<Article> {
        return this.http
            .post<Article>(this.url, JSON.stringify({
                name: name
            }))
            .toPromise()
            // .catch(this.shared.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.url}/${id}`;
        return this.http.delete(url)
            .toPromise()
            .then(() => null)
            // .catch(this.shared.handleError);
    }

}
