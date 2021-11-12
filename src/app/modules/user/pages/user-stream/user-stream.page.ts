import { Component } from '@angular/core';
import { AuthenticationService } from '@app/authentication';

import { Observable, pluck } from 'rxjs';

@Component({
  styleUrls: ['./user-stream.page.scss'],
  templateUrl: './user-stream.page.html',
})
export class UserStreamPage {
  public id$: Observable<number>;

  constructor(private readonly auth: AuthenticationService) {
    this.id$ = this.auth.requireUser$.pipe(pluck('id'));
  }
}
