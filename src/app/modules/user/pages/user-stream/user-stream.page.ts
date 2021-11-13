import { Component } from '@angular/core';
import { Observable, pluck } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

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
